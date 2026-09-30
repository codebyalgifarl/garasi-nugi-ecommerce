import { CheckCircleIcon } from "@/components/layout/icons";

const ITEMS = ["Genuine Parts", "7 Days Return", "Quick Delivery"] as const;

/** Strip kepercayaan di bawah search — hanya tampil di mobile (sesuai Figma). */
export function TrustBar({ className = "" }: { className?: string }) {
  return (
    <section
      aria-label="Our promises"
      className={`w-full border-b border-gray-200 bg-gray-100 md:hidden ${className}`}
    >
      <ul className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 text-xs font-medium text-gray-700">
        {ITEMS.map((item) => (
          <li key={item} className="flex items-center gap-1.5">
            <CheckCircleIcon className="h-4 w-4 shrink-0 text-success" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
