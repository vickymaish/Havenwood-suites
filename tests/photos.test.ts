import assert from "node:assert/strict";
import test from "node:test";
import { getLeadPhotoForListing } from "../lib/photos";

test("each bedroom option uses its requested lead photo", () => {
  assert.equal(getLeadPhotoForListing(1)?.src, "/images/havenwood-bedroom.jpeg");
  assert.equal(getLeadPhotoForListing(2)?.src, "/images/havenwood-lounge-wide.jpeg");
  assert.equal(getLeadPhotoForListing(3)?.src, "/images/havenwood-exterior.jpeg");
});
