import { siteConfig } from "@/lib/constants/site";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  TiktokIcon,
  WhatsappIcon,
} from "./icons";
import { NewsletterForm } from "./NewsletterForm";

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  TikTok: TiktokIcon,
} as const;

const LINK_CLASS =
  "inline-flex min-h-11 items-center gap-2.5 rounded-sm transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 md:min-h-0 md:py-1 md:focus-visible:ring-navy-600";

function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {siteConfig.social.map((item) => {
        const SocialIcon = SOCIAL_ICONS[item.name];
        return (
          <li key={item.name}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} (opens in a new tab)`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 md:h-8 md:w-8 md:text-gray-400 md:hover:text-navy-600 md:focus-visible:ring-navy-600"
            >
              <SocialIcon className="h-5 w-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-white md:mt-20 md:border-t md:border-gray-200 md:bg-white md:text-gray-700">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {/* Customer support */}
          <section aria-labelledby="footer-support">
            <h2
              id="footer-support"
              className="text-base font-bold text-gold-400 md:text-sm md:text-navy-600"
            >
              Customer support
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/75 md:text-gray-600">
              {siteConfig.hoursNote}
            </p>
            <ul className="mt-2 text-sm md:mt-3">
              <li>
                <a href={siteConfig.phone.href} className={LINK_CLASS}>
                  <PhoneIcon className="h-4 w-4 shrink-0 text-gold-400 md:text-gray-700" />
                  {siteConfig.phone.label}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className={LINK_CLASS}>
                  <MailIcon className="h-4 w-4 shrink-0 text-gold-400 md:text-gray-700" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_CLASS}
                >
                  <WhatsappIcon className="h-4 w-4 shrink-0 text-green-400 md:text-success" />
                  <span>
                    <span className="md:hidden">WhatsApp Support</span>
                    <span className="hidden md:inline">
                      Ask your questions on WhatsApp
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </section>

          {/* Store */}
          <section aria-labelledby="footer-store">
            <h2
              id="footer-store"
              className="text-base font-bold text-gold-400 md:text-sm md:text-navy-600"
            >
              <span className="md:hidden">Store Address</span>
              <span className="hidden md:inline">Store</span>
            </h2>
            <address className="mt-3 text-sm not-italic leading-7 text-white/75 md:text-gray-600">
              <span className="md:hidden">{siteConfig.address.join(", ")}</span>
              <span className="hidden md:block">
                {siteConfig.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </address>
          </section>

          {/* Follow us + Newsletter (di mobile: newsletter tampil paling atas) */}
          <div className="order-first md:order-none">
            <div className="hidden md:block">
              <h2 className="text-sm font-bold text-navy-600">Follow us</h2>
              <SocialLinks className="mt-2 -ml-2" />
            </div>
            <div className="md:mt-6">
              <h2 className="text-base font-bold text-white md:text-sm md:text-gray-900">
                Subscribe to our emails
              </h2>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bar bawah (mobile) */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/60 md:hidden">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <SocialLinks className="-mr-2.5" />
        </div>

        {/* Bar bawah (desktop) */}
        <p className="mt-10 hidden border-t border-gray-100 pt-6 text-center text-xs text-gray-500 md:block">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
