import test from "node:test";
import assert from "node:assert/strict";
import { bedroomOptions, siteConfig } from "../data/site";
import { DEFAULT_PUBLIC_SETTINGS, resolvePublicSettings } from "../lib/public-settings-defaults";

test("missing site_settings values use the data/site.ts defaults", () => {
  const settings = resolvePublicSettings(new Map());
  assert.equal(settings.whatsapp_number, siteConfig.whatsappNumber);
  assert.equal(settings.check_in_time, siteConfig.checkInTime);
  assert.equal(settings.check_out_time, siteConfig.checkOutTime);
  assert.deepEqual(settings.bedroom_options, bedroomOptions);
  assert.deepEqual(settings, DEFAULT_PUBLIC_SETTINGS);
});

test("partial saved settings override only configured values", () => {
  const settings = resolvePublicSettings(new Map<string, unknown>([["bedroom_2_price", 6400], ["tagline", "A quieter stay."]]));
  assert.equal(settings.bedroom_options[1]?.pricePerNightKES, 6400);
  assert.equal(settings.tagline, "A quieter stay.");
  assert.equal(settings.bedroom_options[0]?.pricePerNightKES, bedroomOptions[0].pricePerNightKES);
  assert.equal(settings.whatsapp_number, siteConfig.whatsappNumber);
});

test("fallback price and guest limit populate room options when room-specific values are absent", () => {
  const settings = resolvePublicSettings(new Map<string, unknown>([["nightly_price_kes", 7200], ["max_guests", 5]]));
  assert.deepEqual(settings.bedroom_options.map((option) => option.pricePerNightKES), [7200, 7200, 7200]);
  assert.deepEqual(settings.bedroom_options.map((option) => option.maxGuests), [5, 5, 5]);
});

test("room-specific prices and guest limits take precedence over fallback values", () => {
  const settings = resolvePublicSettings(new Map<string, unknown>([
    ["nightly_price_kes", 7200], ["max_guests", 5],
    ["bedroom_1_price", 4500], ["bedroom_1_guests", 2],
  ]));
  assert.deepEqual(settings.bedroom_options.map((option) => option.pricePerNightKES), [4500, 7200, 7200]);
  assert.deepEqual(settings.bedroom_options.map((option) => option.maxGuests), [2, 5, 5]);
});
