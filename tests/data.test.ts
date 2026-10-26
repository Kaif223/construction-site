import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { enabledMarkets, markets } from "../src/config/markets.ts";
import { locales, parseLocale, switchLocalePath } from "../src/i18n/locales.ts";
import { serviceCategories, findService } from "../src/data/services.ts";
import { projects } from "../src/data/projects.ts";
import { rateTables } from "../src/data/rates/index.ts";

test("UAE is the only enabled market, in English and Arabic", () => {
  assert.deepEqual(enabledMarkets.map((market) => market.id), ["ae"]);
  assert.deepEqual(locales, ["en-ae", "ar-ae"]);
  assert.equal(parseLocale("ar-ae")?.dir, "rtl");
  assert.equal(parseLocale("en-ae")?.tag, "en-AE");
  assert.equal(parseLocale("en-sa"), null, "disabled markets must not resolve");
});

test("UAE config lists all seven emirates without claiming coverage", () => {
  const ae = markets.find((market) => market.id === "ae")!;
  assert.equal(ae.currency.code, "AED");
  assert.deepEqual(
    ae.regions.map((region) => region.id),
    ["abu-dhabi", "dubai", "sharjah", "ajman", "umm-al-quwain", "ras-al-khaimah", "fujairah"],
  );
  for (const region of ae.regions) {
    assert.ok(region.name.ar, `${region.id} needs an Arabic name`);
    assert.equal(region.coverage, "unconfirmed", "coverage must stay unconfirmed until verified");
  }
  assert.equal(ae.contact.phone, null, "no invented phone number");
  assert.equal(ae.contact.whatsapp, null, "no invented WhatsApp number");
  assert.equal(ae.tax.rate, null, "tax rate must not be assumed");
});

test("locale paths switch language without losing the route", () => {
  assert.equal(switchLocalePath("/en-ae/services/electrical", "ar-ae"), "/ar-ae/services/electrical");
  assert.equal(switchLocalePath("/en-ae", "ar-ae"), "/ar-ae");
});

test("every market rate table exists and enabled markets reference valid ones", () => {
  for (const market of enabledMarkets) {
    if (market.rateTable) assert.ok(rateTables[market.rateTable], market.id);
  }
});

test("services: 19 categories, unique ids, images on disk, valid cross references", () => {
  assert.equal(serviceCategories.length, 19);
  const ids = serviceCategories.flatMap((category) => category.services.map((service) => service.id));
  assert.equal(new Set(ids).size, ids.length);
  const slugs = new Set(serviceCategories.map((category) => category.slug));
  const projectSlugs = new Set(projects.map((project) => project.slug));
  for (const category of serviceCategories) {
    assert.ok(existsSync(`public${category.image}`), category.image);
    for (const related of category.relatedCategories) assert.ok(slugs.has(related), `${category.slug} → ${related}`);
    for (const related of category.relatedProjects) assert.ok(projectSlugs.has(related), `${category.slug} → ${related}`);
  }
});

test("projects reference real services and real image files, and stay labelled as concepts", () => {
  for (const project of projects) {
    for (const serviceId of project.services) assert.ok(findService(serviceId), `${project.slug} → ${serviceId}`);
    for (const image of [project.cover, ...project.gallery]) assert.ok(existsSync(`public${image.src}`), image.src);
    if (project.status === "concept") {
      assert.equal(project.country, null);
      assert.equal(project.timeline, null);
    }
  }
});

test("Arabic content covers every category, service, project and content item", async () => {
  const { categoriesAr, servicesAr } = await import("../src/content/ar/services.ts");
  const { projectsAr } = await import("../src/content/ar/projects.ts");
  const ar = await import("../src/content/ar/content.ts");
  const content = await import("../src/data/content.ts");
  for (const category of serviceCategories) {
    assert.ok(categoriesAr[category.slug], `category ${category.slug}`);
    assert.equal(categoriesAr[category.slug].scope.length, category.scope.length, `scope ${category.slug}`);
    for (const service of category.services) assert.ok(servicesAr[service.id], `service ${service.id}`);
  }
  for (const project of projects) {
    const t = projectsAr[project.slug];
    assert.ok(t, `project ${project.slug}`);
    assert.equal(t.alts.length, 1 + project.gallery.length, `alts ${project.slug}`);
  }
  for (const stage of content.journeyStages) assert.ok(ar.journeyAr[stage.number], `journey ${stage.number}`);
  for (const step of content.processSteps) assert.ok(ar.processAr[step.number], `process ${step.number}`);
  for (const material of content.materials) assert.ok(ar.materialsAr[material.slug], `material ${material.slug}`);
  for (const benefit of content.benefits) assert.ok(ar.benefitsAr[benefit.id], `benefit ${benefit.id}`);
  for (const faq of content.faqs) assert.ok(ar.faqsAr[faq.id], `faq ${faq.id}`);
});
