export const defaultBusiness = {
  name: "Royal Shine Detailing",
  city: "Birmingham",
  tagline: "Precision Detailing",
  mainAreas: [
    "Sutton Coldfield",
    "Solihull",
    "Edgbaston",
    "Harborne",
    "Moseley",
    "Dorridge",
  ],
  phoneDisplay: "01515 247 233",
  phoneTel: "+201515247233",
  whatsappNumber: "201515247233",
  email: "info@royalshinedetailing.com",
  addressDisplay: "Mobile Service Hub, Birmingham, UK",
  addressLine1: "Royal Shine Mobile Detailing",
  addressLine2: "Serving Birmingham & Surrounding Areas",
  hoursDisplay: "Mon – Sat: 8:00 AM – 7:00 PM | Sunday: Closed",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Birmingham+UK",
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=-1.9500%2C52.4500%2C-1.8300%2C52.5200&layer=mapnik&marker=52.4862%2C-1.8904",
  serviceRadiusMiles: 10,
  socials: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
  footerBlurb:
    "Premium mobile detailing delivered to your doorstep. Restoring showroom perfection across Birmingham.",
};

export const defaultHeroStats = [
  { icon: "trophy", text: "200+ Projects Completed" },
  { icon: "star", text: "5.0 Google Rating" },
  { icon: "shieldCheck", text: "100% Satisfaction Rate" },
];

export const defaultFooterLinks = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/#pricing" },
  { label: "Our Work", href: "/portfolio" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export const defaultFooterServices = [
  { label: "Basic Detail", href: "/#pricing" },
  { label: "Premium Detail", href: "/#pricing" },
  { label: "Ultimate Detail", href: "/#pricing" },
  { label: "Ceramic Coating", href: "/#pricing" },
  { label: "Mobile Detailing", href: "/#contact" },
  { label: "Fleet Services", href: "/#contact" },
];

export function buildDefaultSiteContent({
  pricing = {},
  reviews = {},
  faq = {},
  process = {},
  whyChoose = {},
  contact = {},
} = {}) {
  return {
    business: defaultBusiness,
    heroStats: defaultHeroStats,
    footerLinks: defaultFooterLinks,
    footerServices: defaultFooterServices,
    pricing,
    reviews,
    faq,
    process,
    whyChoose,
    contact,
  };
}
