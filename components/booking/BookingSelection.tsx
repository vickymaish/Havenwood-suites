"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type BookingSelection = { checkIn: string; checkOut: string; guests: string };
type SelectionContextValue = { selection: BookingSelection; setSelection: (value: BookingSelection) => void };
const SelectionContext = createContext<SelectionContextValue | null>(null);

export function BookingSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<BookingSelection>({ checkIn: "", checkOut: "", guests: "1" });
  const value = useMemo(() => ({ selection, setSelection }), [selection]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useBookingSelection() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error("BookingSelectionProvider is missing");
  return context;
}
