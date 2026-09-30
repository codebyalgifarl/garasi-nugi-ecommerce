const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 4500000 → "Rp 4.500.000" */
export function formatRupiah(value: number): string {
  return rupiahFormatter.format(value);
}
