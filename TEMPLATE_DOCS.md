# 🌟 Luxury Hotel & Resort Next.js (TypeScript) Template — Documentation

Thank you for choosing this **Ultra-Luxury Hotel & Resort Template**! Built with **Next.js 15 (App Router)**, **TypeScript**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**.

---

## 📸 Image Rights & Demo Assets Disclaimer

> [!NOTE]
> **Commercial Use Notice**:
> All photographs and media assets included in `/public/images/` are provided for **demonstration and layout preview purposes only**.
> Buyers should replace demo images with their own professional property photography prior to launching their commercial hotel website.

---

## 🚀 Quick Start (Run Locally in 2 Minutes)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the Website**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ 2-Minute Customization: `src/config/hotel.config.ts`

**You do NOT need to edit dozens of component files to rebrand this template.**  
Simply open `src/config/hotel.config.ts`. Because it is fully typed in **TypeScript**, your code editor (VS Code, Cursor, WebStorm) will provide instant auto-completion and error checking.

### 1. Brand & Identity
```typescript
brand: {
  name: "The Grand Azure Resort",
  tagline: "Unrivaled Tropical Luxury",
  subtitle: "Experience 5-star elegance, private villas, and personalized concierge hospitality.",
  logoText: "AZURE",
  logoImage: "/images/brand/logo.png",
  establishedYear: 2024,
  starRating: 5,
}
```

### 2. Contact Details & Social Links
```typescript
contact: {
  address: {
    fullAddress: "450 Ocean Boulevard, Maui, Hawaii 96761",
  },
  phones: {
    primary: "+1 (808) 555-0199",
    reservations: "+1 (808) 555-0200",
  },
  emails: {
    general: "info@grandazure.com",
    reservations: "book@grandazure.com",
  },
}
```

### 3. Adding or Modifying Suites & Rooms
Each suite automatically receives its own dedicated details page at `/rooms/[id]`:
```typescript
rooms: [
  {
    id: "ocean-villa", // Generates /rooms/ocean-villa
    name: "Private Ocean Villa",
    category: "Villas & Gardens",
    tag: "Exclusive",
    image: "/images/rooms/deluxe-oceanview.jpg",
    images: [
      "/images/rooms/deluxe-oceanview.jpg",
      "/images/rooms/presidential-suite.webp"
    ],
    shortDesc: "Overwater villa with private plunge pool and direct lagoon access.",
    description: "Full detailed descriptive text...",
    pricePerNight: 450, // Base USD price
    size: "140 m²",
    bed: "King Bed",
    capacity: "2 Guests",
    features: [ ... ],
    amenities: ["Free High-Speed Wi-Fi", "Plunge Pool", "Espresso Bar"],
  },
]
```

---

## 💱 Multi-Currency Switcher (`src/context/CurrencyContext.tsx`)

The template includes a live currency switcher supporting:
* **USD ($)**
* **EUR (€)**
* **GBP (£)**
* **LKR (Rs.)**

To change exchange rates or add new currencies (e.g. AUD, CAD, AED, JPY), simply edit the `supportedCurrencies` object in `src/context/CurrencyContext.tsx`:
```typescript
export const supportedCurrencies: Record<CurrencyCode, CurrencyDetails> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 1.0 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  LKR: { code: "LKR", symbol: "Rs.", name: "Sri Lankan Rupee", rate: 305.0 },
  AED: { code: "AED", symbol: "AED", name: "UAE Dirham", rate: 3.67 }, // easily added!
};
```

---

## 🛡️ Built-in Security Features

1. **HTTP Security Headers** (`next.config.mjs`):
   * `X-Frame-Options: DENY` (Anti-clickjacking)
   * `X-Content-Type-Options: nosniff` (Anti-MIME sniffing)
   * `Strict-Transport-Security` (Enforced HTTPS)
   * `poweredByHeader: false` (Hides framework version from attackers)
2. **Edge Security Middleware** (`src/middleware.ts`):
   * Protects against directory traversal attacks (`..` or `%2e%2e`).
3. **Client-Side Sanitization** (`src/utils/security.ts`):
   * Strips XSS scripts and dangerous event handlers.
   * Rate limiting to prevent rapid form submission spam.
4. **Honeypot Bot Trap**:
   * Invisible honeypot fields on Contact and Reservation forms to catch and neutralize automated spambots.

---

## 📁 Clean Project Directory Structure

```text
├── public/
│   └── images/
│       ├── brand/         # Clean logos and branding assets
│       ├── hero/          # Banners for Home, Weddings, and Contact
│       ├── rooms/         # Suite and villa photography
│       ├── amenities/     # Pool, dining, and spa imagery
│       └── venues/        # Ballroom and event banquet photos
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Typography, CurrencyProvider & SEO metadata
│   │   ├── globals.css    # Tailwind CSS v4 styling & luxury theme variables
│   │   ├── page.tsx       # Luxury Homepage
│   │   ├── rooms/
│   │   │   ├── page.tsx   # Suites catalog with category filter tabs
│   │   │   └── [id]/      # Dynamic room details page with image gallery
│   │   ├── gallery/       # Fullscreen photo gallery with lightbox
│   │   ├── wedding/       # Weddings & Galas event venues
│   │   ├── contact/       # Contact page with anti-spam inquiry form & FAQ
│   │   └── reservation/   # Interactive booking portal with live bill calculator
│   ├── components/
│   │   ├── NavBar.tsx     # Header with currency switcher & mobile drawer
│   │   ├── Footer.tsx     # Reusable luxury footer
│   │   ├── QuickBookingBar.tsx # Floating hero booking widget
│   │   └── GalleryLightbox.tsx # Fullscreen lightbox modal
│   ├── context/
│   │   └── CurrencyContext.tsx # Live multi-currency conversion
│   ├── config/
│   │   └── hotel.config.ts # Centralized typed configuration file
│   ├── utils/
│   │   └── security.ts    # Input sanitization and validation utilities
│   └── middleware.ts      # Edge security middleware
├── tsconfig.json          # TypeScript compiler configuration
├── .env.example           # Environment variables sample
└── TEMPLATE_DOCS.md       # Buyer setup guide
```

---

## 🌐 1-Click Deployment to Vercel

1. Push this repository to your GitHub or GitLab account.
2. Log in to [Vercel](https://vercel.com).
3. Import this repository.
4. Click **Deploy** — Vercel will automatically detect Next.js and deploy your site globally with automatic SSL.

---

## 🔌 Upgrading to Tier 2 (Full-Stack Backend)

This template operates out of the box in **Inquiry & Template Mode** (generating instant guest confirmation receipts with booking references).

When upgrading to a live database:
1. Copy `.env.example` to `.env.local`:
   ```env
   NEXT_PUBLIC_ENABLE_API_BACKEND=true
   ```
2. Connect your booking endpoints to your MongoDB, PostgreSQL, or Supabase backend.
3. Hook in your payment gateway (Stripe, PayPal, PayHere).
