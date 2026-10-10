import assert from "node:assert/strict";
import test from "node:test";
import { bedroomOptions } from "../data/site";
import { formatNightlyPrice } from "../lib/pricing";
import { siteConfig } from "../data/site";

test("formats each stay option's requested base price", () => {
  assert.equal(formatNightlyPrice(bedroomOptions[0]), "KES 2,000");
  assert.equal(formatNightlyPrice(bedroomOptions[1]), "KES 4,000");
  assert.equal(formatNightlyPrice(bedroomOptions[2]), "KES 5,500 to 6,000");
});

test("the public site config does not contain payment till details", () => {
  assert.equal(Object.hasOwn(siteConfig, "mpesaTill"), false);
  assert.equal(Object.hasOwn(siteConfig, "showTillPublicly"), false);
});
