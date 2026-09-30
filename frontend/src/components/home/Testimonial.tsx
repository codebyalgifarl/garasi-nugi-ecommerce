import Link from "next/link";
import { ChevronRightIcon, StarIcon } from "@/components/layout/icons";

/** Titik bintang 5 sudut "gemuk" — dihitung sekali, deterministik (aman untuk hydration). */
const BIG_STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const radius = i % 2 === 0 ? 80 : 40;
  const angle = ((-90 + i * 36) * Math.PI) / 180;
  return `${(100 + radius * Math.cos(angle)).toFixed(1)},${(104 + radius * Math.sin(angle)).toFixed(1)}`;
}).join(" ");

interface TestimonialData {
  quote: string;
  author: string;
  date: string;
  /** 1–5 */
  rating: number;
}

interface TestimonialProps {
  testimonial: TestimonialData;
  className?: string;
}

export function Testimonial({ testimonial, className = "" }: TestimonialProps) {
  const { quote, author, date, rating } = testimonial;

  return (
    <section
      aria-labelledby="testimonial-heading"
      className={`mt-10 w-full bg-navy-600 py-8 md:mt-0 md:bg-transparent md:py-0 md:pt-20 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gold-400 md:hidden">
          Testimonial
        </p>

        <div className="mb-4 mt-1 flex items-center justify-between md:mb-6 md:mt-0">
          <h2
            id="testimonial-heading"
            className="text-xl font-bold text-white md:text-2xl md:text-navy-600"
          >
            <span className="md:hidden">European Car Owners Trust Us</span>
            <span className="hidden md:inline">Trusted by European Car Owners</span>
          </h2>
          <Link
            href="/reviews"
            className="hidden items-center gap-0.5 rounded-sm text-sm font-semibold text-aqua-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 md:inline-flex"
          >
            View all
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <figure className="overflow-hidden rounded-xl bg-white p-5 md:grid md:min-h-[300px] md:grid-cols-2 md:items-center md:bg-navy-600 md:p-12 md:shadow-2xl md:shadow-navy-900/30">
          <div>
            <blockquote className="text-sm leading-6 text-gray-800 md:text-xl md:font-semibold md:leading-9 md:text-white">
              “{quote}”
            </blockquote>
            <figcaption className="mt-5">
              <div
                role="img"
                aria-label={`Rated ${rating} out of 5 stars`}
                className="flex gap-1 text-gold-400"
              >
                {Array.from({ length: rating }, (_, i) => (
                  <StarIcon key={i} className="h-4 w-4 md:h-5 md:w-5" />
                ))}
              </div>
              <p className="mt-2 text-sm font-semibold text-navy-600 md:text-white">
                {author}
              </p>
              <p className="text-xs text-gray-500 md:text-white/70">{date}</p>
            </figcaption>
          </div>

          {/* Ornamen bintang besar (dekoratif, desktop saja) */}
          <div className="hidden justify-center md:flex" aria-hidden="true">
            <svg
              viewBox="0 0 200 200"
              className="h-56 w-56 -rotate-[14deg] drop-shadow-[0_18px_22px_rgba(0,0,0,0.35)]"
            >
              <polygon
                points={BIG_STAR_POINTS}
                fill="#CD9F2B"
                stroke="#CD9F2B"
                strokeWidth="14"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </figure>
      </div>
    </section>
  );
}
