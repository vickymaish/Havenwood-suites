import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppLink } from "../lib/contact";

test("builds the property's WhatsApp link with encoded default text", () => {
  const message = "Hi, I'd like to enquire about Havenwood Suites.";
  assert.equal(buildWhatsAppLink(), `https://wa.me/254116393674?text=${encodeURIComponent(message)}`);
});
