export type DateRange = { start: string; end: string };

/** Treat stays and blocks as half-open ranges: start is included, end is excluded. */
export function dateRangesOverlap(firstStart: string, firstEnd: string, secondStart: string, secondEnd: string): boolean {
  return firstStart < secondEnd && secondStart < firstEnd;
}

export function hasBlockedDateOverlap(checkIn: string, checkOut: string, blockedRanges: readonly DateRange[]): boolean {
  return blockedRanges.some((range) => dateRangesOverlap(checkIn, checkOut, range.start, range.end));
}
