export function formatNightlyPrice(option: { pricePerNightKES: number; priceMax?: number }): string {
  const min = option.pricePerNightKES.toLocaleString("en-US");
  if (option.priceMax && option.priceMax > option.pricePerNightKES) {
    return `KES ${min} to ${option.priceMax.toLocaleString("en-US")}`;
  }
  return `KES ${min}`;
}
