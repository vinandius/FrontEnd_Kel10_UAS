-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'customer',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'id',
    "contactHeading" TEXT NOT NULL,
    "socialPrompt" TEXT NOT NULL,
    "feedbackPrompt" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "fallbackImageId" INTEGER,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteText" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SiteText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavLink" (
    "id" SERIAL NOT NULL,
    "menu" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'all',
    "position" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NavLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "iconId" INTEGER,
    "position" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "page" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "badge" TEXT,
    "tagline" TEXT,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "imageId" INTEGER,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionParagraph" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'body',
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "SectionParagraph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionItem" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT,
    "accent" TEXT,
    "imageId" INTEGER,
    "position" INTEGER NOT NULL,

    CONSTRAINT "SectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RendangType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RendangType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "img" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_productId_key" ON "CartItem"("userId", "productId");

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_fallbackImageId_fkey" FOREIGN KEY ("fallbackImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionParagraph" ADD CONSTRAINT "SectionParagraph_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionItem" ADD CONSTRAINT "SectionItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionItem" ADD CONSTRAINT "SectionItem_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendangType" ADD CONSTRAINT "RendangType_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
