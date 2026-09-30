import { SearchIcon } from "./icons";

interface SearchBarProps {
  className?: string;
}

/**
 * Form GET biasa ke /catalog?q=... — jalan tanpa JavaScript.
 * TODO: pastikan halaman Catalog membaca query `q` (card EP3).
 */
export function SearchBar({ className = "" }: SearchBarProps) {
  return (
    <form
      role="search"
      action="/catalog"
      method="get"
      className={`relative mx-auto w-full max-w-2xl ${className}`}
    >
      <label htmlFor="site-search" className="sr-only">
        Search spare parts
      </label>
      <input
        id="site-search"
        type="search"
        name="q"
        autoComplete="off"
        spellCheck={false}
        placeholder="What are you looking for?"
        className="h-12 w-full rounded-full bg-white pl-5 pr-14 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-[3px] focus:ring-gold-400/70 md:bg-navy-600 md:text-white md:placeholder:text-white/75 md:shadow-md md:shadow-navy-900/20 md:focus:ring-navy-600/30"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-navy-600 hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 md:text-white md:hover:bg-white/10 md:focus-visible:ring-white"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
