/**
 * Info toko — dipakai di Footer.
 * TODO: nilai di bawah masih dummy dari desain Figma. Ganti dengan data asli
 * (termasuk akun sosial media) sebelum go-live.
 */
export const siteConfig = {
  name: "Garasi Nugi",
  phone: { label: "+62 812 3456 7890", href: "tel:+6281234567890" },
  email: "support@garasinugi.com",
  whatsappUrl: "https://wa.me/6281234567890",
  hoursNote: "Available everyday 09:00 - 18:00. Happy to answer your questions!",
  address: ["Jl. Setiabudi No. 123", "Bandung, West Java", "Indonesia"],
  social: [
    { name: "Instagram", href: "https://www.instagram.com/" },
    { name: "Facebook", href: "https://www.facebook.com/" },
    { name: "TikTok", href: "https://www.tiktok.com/" },
  ],
} as const;
