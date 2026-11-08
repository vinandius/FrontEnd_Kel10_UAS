import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { Product } from "./db";
import type { FooterData, NavItem, TextMap } from "./types";

function must<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Data "${what}" belum ada di database. Jalankan: npm run db:seed`);
  }
  return value;
}

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: 1 },
    include: { fallbackImage: true },
  });
  return must(settings, "SiteSetting");
});

export const getNavLinks = cache(async (menu: string): Promise<NavItem[]> => {
  const links = await prisma.navLink.findMany({
    where: { menu, isActive: true },
    orderBy: { position: "asc" },
  });
  return links.map(({ id, label, path, visibility }) => ({ id, label, path, visibility }));
});

export const getHero = cache(async (page: string) => {
  const hero = await prisma.hero.findUnique({ where: { page }, include: { image: true } });
  return must(hero, `Hero "${page}"`);
});

export const getTexts = cache(async (...groups: string[]): Promise<TextMap> => {
  const rows = await prisma.siteText.findMany({ where: { group: { in: groups } } });
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
});

export const getFooterData = cache(async (): Promise<FooterData> => {
  const [settings, socials] = await Promise.all([
    getSiteSettings(),
    prisma.socialLink.findMany({
      where: { isActive: true },
      include: { icon: true },
      orderBy: { position: "asc" },
    }),
  ]);
  return {
    heading: settings.contactHeading,
    socialPrompt: settings.socialPrompt,
    feedbackPrompt: settings.feedbackPrompt,
    email: settings.contactEmail,
    socials: socials.map((s) => ({
      id: s.id,
      label: s.label,
      url: s.url,
      iconUrl: s.icon?.url ?? null,
      iconAlt: s.icon?.alt ?? null,
    })),
  };
});

const sectionInclude = {
  image: true,
  paragraphs: { orderBy: { position: "asc" } },
  items: { include: { image: true }, orderBy: { position: "asc" } },
} satisfies Prisma.SectionInclude;

export type SectionWithContent = Prisma.SectionGetPayload<{ include: typeof sectionInclude }>;

export const getSection = cache(async (key: string): Promise<SectionWithContent> => {
  const section = await prisma.section.findUnique({ where: { key }, include: sectionInclude });
  return must(section, `Section "${key}"`);
});

export const getVisibleSectionKeys = cache(async (): Promise<string[]> => {
  const sections = await prisma.section.findMany({
    where: { isVisible: true },
    orderBy: { position: "asc" },
    select: { key: true },
  });
  return sections.map((s) => s.key);
});

export const getRendangTypes = cache(async () => {
  return prisma.rendangType.findMany({
    where: { isVisible: true },
    include: { image: true },
    orderBy: { position: "asc" },
  });
});

export async function getProducts(): Promise<Product[]> {
  return prisma.product.findMany({ orderBy: { id: "asc" } });
}