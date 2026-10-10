import test from "node:test";
import assert from "node:assert/strict";
import { addDays, format } from "date-fns";
import { bedroomOptions } from "../data/site";
import { calcNights, createEnquirySchema, enquirySchema, estimateTotalKES, normalizeKenyanPhone } from "../lib/validation";

test("normalizes Kenyan phone formats and rejects other or malformed numbers", () => {
  const cases: [string, string][] = [
    ["0712345678", "254712345678"],
    ["0116393674", "254116393674"],
    ["+254116393674", "254116393674"],
    ["254712345678", "254712345678"],
  ];
  for (const [input, expected] of cases) assert.equal(normalizeKenyanPhone(input), expected);
  for (const input of ["07ABC45678", "07123", "+255712345678"]) assert.equal(normalizeKenyanPhone(input), null);
});

test("calculates nights and estimates totals for every bedroom option", () => {
  assert.equal(calcNights("2030-06-10", "2030-06-13"), 3);
  assert.equal(calcNights("2030-06-13", "2030-06-10"), 0);
  const testRates = { 1: 4100, 2: 6200, 3: 8300 } as const;
  for (const option of bedroomOptions) {
    assert.equal(estimateTotalKES(3, testRates[option.bedrooms]), 3 * testRates[option.bedrooms]);
  }
  assert.equal(estimateTotalKES(0, 100), 0);
});

const futureDate = (days: number) => format(addDays(new Date(), days), "yyyy-MM-dd");
function enquiry(bedrooms: "1" | "2" | "3" = "1", overrides: Record<string, string> = {}) {
  return {
    name: "Guest Name",
    phone: "0712345678",
    email: "guest@example.test",
    bedrooms,
    checkIn: futureDate(5),
    checkOut: futureDate(7),
    guests: "2",
    message: "",
    botcheck: "",
    ...overrides,
  };
}

test("enquiry schema rejects invalid dates, capacity, email, and short names", () => {
  const limits = [1, 2, 3].map((bedrooms) => ({ bedrooms: bedrooms as 1 | 2 | 3, maxGuests: bedrooms * 2 }));
  const schema = createEnquirySchema(limits);
  assert.equal(schema.safeParse(enquiry("1", { checkIn: "2000-01-01" })).success, false);
  assert.equal(schema.safeParse(enquiry("1", { checkOut: futureDate(5) })).success, false);
  assert.equal(schema.safeParse(enquiry("1", { checkOut: futureDate(66) })).success, false);
  assert.equal(schema.safeParse(enquiry("1", { guests: "3" })).success, false);
  assert.equal(enquirySchema.safeParse(enquiry("1", { email: "not-an-email" })).success, false);
  assert.equal(enquirySchema.safeParse(enquiry("1", { name: "A" })).success, false);
});

test("accepts valid enquiries for each bedroom option", () => {
  const schema = createEnquirySchema([1, 2, 3].map((bedrooms) => ({ bedrooms: bedrooms as 1 | 2 | 3, maxGuests: bedrooms * 2 })));
  for (const bedrooms of ["1", "2", "3"] as const) {
    const result = schema.safeParse(enquiry(bedrooms, { guests: String(Number(bedrooms) * 2) }));
    assert.equal(result.success, true, `bedroom option ${bedrooms} should validate`);
  }
});
