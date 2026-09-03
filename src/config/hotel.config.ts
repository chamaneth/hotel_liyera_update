/**
 * ===================================================================
 * HOTEL TEMPLATE CONFIGURATION (TypeScript)
 * ===================================================================
 * 
 * Central configuration file for the luxury hotel & resort template.
 * Fully typed with TypeScript for error-free customization and autocomplete.
 */

export interface BrandConfig {
  name: string;
  tagline: string;
  subtitle: string;
  logoText: string;
  logoImage: string;
  establishedYear: number;
  starRating: number;
}

export interface CurrencyConfig {
  defaultCode: "USD" | "EUR" | "GBP" | "LKR";
  taxRatePercentage: number;
  serviceFeePercentage: number;
}

export interface ContactConfig {
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
    fullAddress: string;
  };
  phones: {
    primary: string;
    reservations: string;
    concierge: string;
  };
  emails: {
    general: string;
    reservations: string;
    events: string;
  };
  checkInOut: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    tripadvisor: string;
    whatsapp: string;
  };
}

export interface HeroConfig {
  badge: string;
  heading: string;
  subheading: string;
  bgImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface AmenityItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  tag: string;
}

export interface RoomItem {
  id: string;
  name: string;
  category: string;
  tag: string;
  image: string;
  images: string[];
  shortDesc: string;
  description: string;
  pricePerNight: number; // Base USD price
  size: string;
  bed: string;
  capacity: string;
  features: string[];
  amenities: string[];
}

export interface VenueItem {
  id: string;
  name: string;
  image: string;
  capacity: string;
  desc: string;
  highlights: string[];
}

export interface TestimonialItem {
  name: string;
  location: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: "Suites" | "Dining" | "Wellness & Pool" | "Venues";
  src: string;
  desc: string;
}

export interface HotelConfig {
  brand: BrandConfig;
  currency: CurrencyConfig;
  contact: ContactConfig;
  hero: HeroConfig;
  amenities: AmenityItem[];
  rooms: RoomItem[];
  venues: VenueItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  navigation: NavItem[];
  gallery: GalleryPhoto[];
}

export const hotelConfig: HotelConfig = {
  // Brand & Identity
  brand: {
    name: "Hotel Liyera",
    tagline: "Where Modern Luxury Meets Serene Heritage",
    subtitle: "Experience 5-star elegance, personalized hospitality, and breathtaking views.",
    logoText: "LIYERA",
    logoImage: "/images/brand/logo.png",
    establishedYear: 2024,
    starRating: 5,
  },

  // Currency & Financials
  currency: {
    defaultCode: "USD",
    taxRatePercentage: 10,
    serviceFeePercentage: 5,
  },

  // Contact & Location Details
  contact: {
    address: {
      street: "120 Ocean View Boulevard",
      city: "Coastal Sanctuary",
      region: "Coastal Bay",
      country: "United States",
      postalCode: "90210",
      fullAddress: "120 Ocean View Boulevard, Coastal Sanctuary Suite 500",
    },
    phones: {
      primary: "+1 (800) 555-0199",
      reservations: "+1 (800) 555-0120",
      concierge: "+1 (800) 555-0199",
    },
    emails: {
      general: "info@hotelliyera.com",
      reservations: "reservations@hotelliyera.com",
      events: "events@hotelliyera.com",
    },
    checkInOut: {
      checkInTime: "2:00 PM",
      checkOutTime: "12:00 PM",
      cancellationPolicy: "Free cancellation up to 48 hours prior to arrival.",
    },
    socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      tripadvisor: "https://tripadvisor.com",
      whatsapp: "https://wa.me/",
    },
  },

  // Hero Section
  hero: {
    badge: "WELCOME TO UNRIVALED LUXURY",
    heading: "Experience the Art of Pure Tranquility",
    subheading:
      "Nestled amidst lush landscapes, Hotel Liyera pairs world-class architectural grandeur with warm, heartfelt boutique hospitality.",
    bgImage: "/images/hero/hero-banner.avif",
    ctaText: "Explore Suites",
    ctaLink: "/rooms",
  },

  // Signature Amenities & Experiences
  amenities: [
    {
      id: "suites",
      title: "Luxury Suites",
      desc: "Lavish master bedrooms with private balconies and panoramic vistas.",
      image: "/images/amenities/luxury-suites.jpg",
      tag: "Accommodations",
    },
    {
      id: "infinity-pool",
      title: "Infinity Pool",
      desc: "Heated horizon pool overlooking lush green canopy and tranquil horizons.",
      image: "/images/amenities/infinity-pool.avif",
      tag: "Wellness",
    },
    {
      id: "fine-dining",
      title: "Gourmet Dining",
      desc: "Michelin-inspired culinary arts curated with organic island produce.",
      image: "/images/amenities/gourmet-dining.jpg",
      tag: "Culinary",
    },
    {
      id: "ayurveda-spa",
      title: "Ayurveda & Spa",
      desc: "Holistic treatments, bespoke therapies, and revitalizing wellness rituals.",
      image: "/images/amenities/wellness-spa.webp",
      tag: "Revitalization",
    },
  ],

  // Rooms & Suites Catalog
  rooms: [
    {
      id: "presidential-suite",
      name: "Presidential Suite",
      category: "Signature Suites",
      tag: "Ultra Luxury",
      image: "/images/rooms/presidential-suite.webp",
      images: [
        "/images/rooms/presidential-suite.webp",
        "/images/rooms/deluxe-oceanview.jpg",
        "/images/amenities/luxury-suites.jpg",
      ],
      shortDesc: "The pinnacle of royal elegance, private terrace, jacuzzi, and dedicated butler.",
      description:
        "Designed for royalty and discerning travelers, our Presidential Suite boasts expansive living spaces, bespoke Italian furniture, an open-air jacuzzi terrace, and 24/7 personalized butler service.",
      pricePerNight: 280,
      size: "120 m²",
      bed: "King Bed",
      capacity: "4 Guests",
      features: [
        "120 m² Panoramic Living Space",
        "Private Terrace with Jacuzzi",
        "Dedicated 24/7 Butler Service",
        "Complimentary Moët & Chandon on arrival",
        "Private VIP Lounge & Bar Access",
        "Marble bathroom with rain shower & soaking tub",
      ],
      amenities: ["Free High-Speed Wi-Fi", "Espresso Machine", "Mini Bar", "Smart TV", "Safe", "Air Conditioning"],
    },
    {
      id: "deluxe-oceanview",
      name: "Deluxe Oceanview Suite",
      category: "Ocean View",
      tag: "Popular Choice",
      image: "/images/rooms/deluxe-oceanview.jpg",
      images: [
        "/images/rooms/deluxe-oceanview.jpg",
        "/images/rooms/presidential-suite.webp",
        "/images/amenities/luxury-suites.jpg",
      ],
      shortDesc: "Wake up to sweeping horizon vistas, private sun terrace, and lavish comforts.",
      description:
        "Immerse yourself in serenity with soothing views, custom handcrafted linens, an expansive private balcony, and state-of-the-art entertainment amenities.",
      pricePerNight: 160,
      size: "65 m²",
      bed: "King Bed",
      capacity: "2 Guests",
      features: [
        "65 m² Master Space",
        "Private Balcony with Daybed",
        "Rainfall Walk-In Shower",
        "Chef's Gourmet Breakfast included",
        "24-hour In-Room Dining",
      ],
      amenities: ["High-Speed Wi-Fi", "Cocktail Bar", "Bathrobes & Slippers", "Smart TV", "Work Desk"],
    },
    {
      id: "premier-garden",
      name: "Premier Garden Villa",
      category: "Villas & Gardens",
      tag: "Best for Couples",
      image: "/images/rooms/premier-garden.jpg",
      images: [
        "/images/rooms/premier-garden.jpg",
        "/images/rooms/standard-deluxe.jpg",
        "/images/amenities/luxury-suites.jpg",
      ],
      shortDesc: "Tucked away in tropical gardens offering seclusion, calm, and private veranda.",
      description:
        "Surrounded by fragrant blossoms and tropical birdsong, this secluded sanctuary offers an intimate escape with private garden access and open-air bath options.",
      pricePerNight: 120,
      size: "55 m²",
      bed: "King Bed",
      capacity: "2 Guests",
      features: [
        "55 m² Tropical Haven",
        "Private Garden Veranda",
        "Stone Soaking Bathtub",
        "Complimentary Afternoon High Tea",
        "Yoga Mat & Wellness Kit",
      ],
      amenities: ["High-Speed Wi-Fi", "Tea & Coffee Station", "Eco-friendly Toiletries", "Safe", "Mini Fridge"],
    },
    {
      id: "standard-deluxe",
      name: "Classic Deluxe Room",
      category: "Deluxe Rooms",
      tag: "Essential Comfort",
      image: "/images/rooms/standard-deluxe.jpg",
      images: [
        "/images/rooms/standard-deluxe.jpg",
        "/images/rooms/premier-garden.jpg",
        "/images/amenities/luxury-suites.jpg",
      ],
      shortDesc: "Sophisticated styling and high ceilings, ideal for modern travelers and couples.",
      description:
        "A harmonious blend of contemporary design and comfort, featuring soaring ceilings, plush bedding, and an ergonomic workspace.",
      pricePerNight: 85,
      size: "38 m²",
      bed: "Queen or Twin Beds",
      capacity: "2 Guests",
      features: [
        "38 m² Contemporary Space",
        "City & Courtyard View",
        "Luxury Feather Pillows",
        "Spacious En-Suite Bath",
        "Fast Fiber Internet",
      ],
      amenities: ["High-Speed Wi-Fi", "LED Television", "Coffee Maker", "Hairdryer", "Climate Control"],
    },
  ],

  // Wedding & Event Venues
  venues: [
    {
      id: "grand-ballroom",
      name: "The Grand Imperial Ballroom",
      image: "/images/venues/grand-ballroom.jpeg",
      capacity: "Up to 1,000 Guests",
      desc: "Opulent crystal chandeliers, dramatic high ceilings, and state-of-the-art concert acoustics for landmark celebrations.",
      highlights: [
        "Capacity: Up to 1,000 guests",
        "High ceilings with Austrian crystal chandeliers",
        "Custom intelligent lighting & 4K AV projections",
        "Private bridal suite with powder room",
        "Expansive dance floor & live orchestra stage",
        "Dedicated Michelin-trained culinary brigade",
      ],
    },
    {
      id: "royal-banquet",
      name: "Royal Palace Pavilion",
      image: "/images/venues/royal-banquet.jpeg",
      capacity: "Up to 1,500 Guests",
      desc: "A monumental setting designed for mega weddings, state banquets, and high-profile international conferences.",
      highlights: [
        "Capacity: Up to 1,500 guests",
        "Monumental pillarless architectural design",
        "VIP reception lounge & presidential green rooms",
        "Multi-cuisine live catering kitchens",
        "Red carpet VIP arrival foyer",
      ],
    },
    {
      id: "elegance-banquet",
      name: "Elegance Garden Terrace",
      image: "/images/venues/elegance-terrace.jpg",
      capacity: "Up to 400 Guests",
      desc: "Sophisticated indoor-outdoor setting with ambient garden lighting, ideal for romantic receptions and cocktail evenings.",
      highlights: [
        "Capacity: Up to 400 guests",
        "Under-the-stars cocktail lawn",
        "Bespoke floral & thematic styling team",
        "Curated artisanal cocktail bar",
        "Intimate acoustic setup",
      ],
    },
  ],

  // Testimonials
  testimonials: [
    {
      name: "Sarah & David Montgomery",
      location: "London, United Kingdom",
      rating: 5,
      text: "Our stay at Hotel Liyera was nothing short of magical. The infinity pool overlooking the misty morning canopy and the impeccable hospitality made our anniversary unforgettable.",
    },
    {
      name: "Marcus Vance",
      location: "Singapore",
      rating: 5,
      text: "As a frequent business traveler, the tranquility, lightning-fast Wi-Fi, and spacious presidential suite provided the ultimate environment to recharge and work.",
    },
    {
      name: "Elena Rostova",
      location: "Zurich, Switzerland",
      rating: 5,
      text: "The gourmet dining is world class. Every single dish was an authentic work of art. We have already booked our return visit for next winter!",
    },
    {
      name: "Dr. Anil & Priya Sharma",
      location: "Mumbai, India",
      rating: 5,
      text: "From our midnight check-in to the tailored ayurvedic spa sessions, the attention to detail was 5-star perfection. Highly recommended.",
    },
  ],

  // Frequently Asked Questions
  faqs: [
    {
      q: "What are your check-in and check-out times?",
      a: "Standard check-in begins at 2:00 PM and check-out is until 12:00 PM. Early check-in or late check-out can be requested subject to availability.",
    },
    {
      q: "Do you offer airport transfer services?",
      a: "Yes! We provide luxury private airport chauffeur transfers in our premium executive sedans and SUVs upon advance request.",
    },
    {
      q: "Is high-speed Wi-Fi included in room rates?",
      a: "Yes, complimentary high-speed fiber-optic Wi-Fi is available in all rooms, suites, and public resort areas.",
    },
    {
      q: "What is your cancellation policy?",
      a: "Flexible cancellations are permitted up to 48 hours prior to your scheduled arrival date without any penalty fees.",
    },
    {
      q: "Can I host private events or destination weddings here?",
      a: "Absolutely. Our dedicated wedding and event planning team handles bespoke catering, décor, audiovisuals, and accommodation packages.",
    },
  ],

  // Navigation Menu Links
  navigation: [
    { label: "Home", href: "/" },
    { label: "Suites & Rooms", href: "/rooms" },
    { label: "Gallery", href: "/gallery" },
    { label: "Weddings & Events", href: "/wedding" },
    { label: "Contact", href: "/contact" },
  ],

  // Resort Photography Gallery
  gallery: [
    {
      id: "gal-1",
      title: "Presidential Jacuzzi Terrace",
      category: "Suites",
      src: "/images/rooms/presidential-suite.webp",
      desc: "Expansive private terrace overlooking misty tropical canopy.",
    },
    {
      id: "gal-2",
      title: "Horizon Infinity Pool",
      category: "Wellness & Pool",
      src: "/images/amenities/infinity-pool.avif",
      desc: "Temperature-controlled infinity pool with panoramic sunset horizons.",
    },
    {
      id: "gal-3",
      title: "The Grand Imperial Ballroom",
      category: "Venues",
      src: "/images/venues/grand-ballroom.jpeg",
      desc: "Austrian crystal chandeliers and state-of-the-art concert acoustics.",
    },
    {
      id: "gal-4",
      title: "Gourmet Ocean-View Dining",
      category: "Dining",
      src: "/images/amenities/gourmet-dining.jpg",
      desc: "Artisanal culinary dining prepared with organic island ingredients.",
    },
    {
      id: "gal-5",
      title: "Deluxe Oceanview Suite",
      category: "Suites",
      src: "/images/rooms/deluxe-oceanview.jpg",
      desc: "Sweeping sunrise vistas and custom handcrafted linens.",
    },
    {
      id: "gal-6",
      title: "Holistic Ayurveda Sanctuary",
      category: "Wellness & Pool",
      src: "/images/amenities/wellness-spa.webp",
      desc: "Bespoke therapies, steam baths, and herbal rejuvenation treatments.",
    },
    {
      id: "gal-7",
      title: "Royal Palace Banquet",
      category: "Venues",
      src: "/images/venues/royal-banquet.jpeg",
      desc: "Pillarless royal pavilion hosting prestigious galas and weddings.",
    },
    {
      id: "gal-8",
      title: "Premier Garden Seclusion",
      category: "Suites",
      src: "/images/rooms/premier-garden.jpg",
      desc: "Private veranda tucked into serene flora and birdlife.",
    },
  ],
};
