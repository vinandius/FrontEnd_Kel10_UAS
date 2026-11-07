export type Role = "admin" | "customer";

export type Session = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type CartItem = {
  id: number,
  qty: number
}

export type TextMap = Record<string, string>;

export type NavItem = {
  id: number;
  label: string;
  path: string;
  visibility: string; // "all" | "guest" | "member"
};

export type FooterData = {
  heading: string;
  socialPrompt: string;
  feedbackPrompt: string;
  email: string;
  socials: {
    id: number;
    label: string;
    url: string;
    iconUrl: string | null;
    iconAlt: string | null;
  }[];
};