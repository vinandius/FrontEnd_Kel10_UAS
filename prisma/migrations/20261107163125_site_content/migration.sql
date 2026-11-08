-- CreateTable
CREATE TABLE "Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'id',
    "contactHeading" TEXT NOT NULL,
    "socialPrompt" TEXT NOT NULL,
    "feedbackPrompt" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "fallbackImageId" INTEGER,
    CONSTRAINT "SiteSetting_fallbackImageId_fkey" FOREIGN KEY ("fallbackImageId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteText" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "NavLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "menu" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'all',
    "position" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "platform" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "iconId" INTEGER,
    "position" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "SocialLink_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Hero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "badge" TEXT,
    "tagline" TEXT,
    "imageId" INTEGER NOT NULL,
    CONSTRAINT "Hero_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "imageId" INTEGER,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Section_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SectionParagraph" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sectionId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'body',
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "SectionParagraph_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SectionItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sectionId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT,
    "accent" TEXT,
    "imageId" INTEGER,
    "position" INTEGER NOT NULL,
    CONSTRAINT "SectionItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SectionItem_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RendangType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "RendangType_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_url_key" ON "Media"("url");

-- CreateIndex
CREATE UNIQUE INDEX "SiteText_key_key" ON "SiteText"("key");

-- CreateIndex
CREATE INDEX "SiteText_group_idx" ON "SiteText"("group");

-- CreateIndex
CREATE INDEX "NavLink_menu_position_idx" ON "NavLink"("menu", "position");

-- CreateIndex
CREATE INDEX "SocialLink_position_idx" ON "SocialLink"("position");

-- CreateIndex
CREATE UNIQUE INDEX "Hero_page_key" ON "Hero"("page");

-- CreateIndex
CREATE UNIQUE INDEX "Section_key_key" ON "Section"("key");

-- CreateIndex
CREATE INDEX "Section_position_idx" ON "Section"("position");

-- CreateIndex
CREATE INDEX "SectionParagraph_sectionId_position_idx" ON "SectionParagraph"("sectionId", "position");

-- CreateIndex
CREATE INDEX "SectionItem_sectionId_kind_position_idx" ON "SectionItem"("sectionId", "kind", "position");

-- CreateIndex
CREATE INDEX "RendangType_position_idx" ON "RendangType"("position");
