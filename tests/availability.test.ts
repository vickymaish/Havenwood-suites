import test from "node:test";
import assert from "node:assert/strict";
import { dateRangesOverlap, hasBlockedDateOverlap } from "../lib/availability";

test("a 10–13 June block includes the start and excludes the end", () => {
  const blocked = [{ start: "2030-06-10", end: "2030-06-13" }];
  assert.equal(hasBlockedDateOverlap("2030-06-10", "2030-06-11", blocked), true);
  assert.equal(hasBlockedDateOverlap("2030-06-12", "2030-06-13", blocked), true);
  assert.equal(hasBlockedDateOverlap("2030-06-13", "2030-06-14", blocked), false);
  assert.equal(hasBlockedDateOverlap("2030-06-09", "2030-06-10", blocked), false);
});

test("back-to-back stays do not overlap", () => {
  assert.equal(dateRangesOverlap("2030-06-10", "2030-06-13", "2030-06-13", "2030-06-15"), false);
  assert.equal(dateRangesOverlap("2030-06-13", "2030-06-15", "2030-06-10", "2030-06-13"), false);
});
