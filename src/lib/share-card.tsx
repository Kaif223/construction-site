import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";
import { cacheLife } from "next/cache";
import sharp from "sharp";
import { siteConfig } from "@/config/site";
import type { LanguageCode } from "@/config/markets";
import { shareCardSize } from "@/lib/share-card-size";

export { shareCardContentType, shareCardSize } from "@/lib/share-card-size";

/*
 * Branded share card (Open Graph / social preview) used by the
 * `opengraph-image` routes. Light brand surface with the headline on one side
 * and a photograph on the other; mirrored for right-to-left languages.
 *
 * - Cards are cached (`use cache`), so they are prerendered at build time and
 *   served as static files.
 * - next/og renders PNG, which is large for a photograph (~850 KB); messaging
 *   apps such as WhatsApp skip preview images that big, so the card is
 *   re-encoded as JPEG (~100 KB).
 * - next/og cannot lay out Arabic (no bidi reordering or full letter
 *   shaping), so for Arabic it draws only the frame and sharp, whose text
 *   renderer shapes Arabic properly, draws the words into it.
 */

type CardText = {
  language: LanguageCode;
  eyebrow: string;
  /** One string, or authored lines (kept as line breaks in Arabic). */
  title: string | string[];
  subtitle: string;
  footer: string;
  /** Path under /public, e.g. "/images/hero/residence-dusk.jpg". */
  image: string;
};

const { width: WIDTH, height: HEIGHT } = shareCardSize;
const PHOTO_WIDTH = 510;
const PAD = 60;

const fontPath = (name: string) => join(process.cwd(), "assets/fonts", name);
const latinFonts = await Promise.all([
  readFile(fontPath("NotoSans-Regular.ttf")).then((data) => ({ name: "Noto Sans", data, weight: 400 as const })),
  readFile(fontPath("NotoSans-SemiBold.ttf")).then((data) => ({ name: "Noto Sans", data, weight: 600 as const })),
]);

const colors = {
  ivory: "#f5f2eb",
  charcoal: "#171918",
  muted: "#595c57",
  orange: "#e86b35",
  orangeInk: "#a63f15",
  line: "rgba(23, 25, 24, 0.14)",
};

/** Reads an image from /public as a data URL that next/og can embed. */
async function publicImage(src: string) {
  const data = await readFile(join(process.cwd(), "public", src));
  const type = extname(src).toLowerCase() === ".png" ? "image/png" : "image/jpeg";
  return `data:${type};base64,${data.toString("base64")}`;
}

/** Shortens text to whole words so it fits the card. */
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max)).replace(/[,;:.\s—-]+$/, "")}…`;
}

function Corner({ rotate }: { rotate: number }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M2 30V2h28" stroke="rgba(245,242,235,0.85)" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

/** The card. With `textless`, the headline block is left empty for sharp to fill. */
function Card({ text, photo, textless }: { text: CardText; photo: string; textless: boolean }) {
  const rtl = text.language === "ar";
  const title = Array.isArray(text.title) ? text.title.join(" ") : text.title;
  const host = new URL(siteConfig.url).host;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: rtl ? "row-reverse" : "row",
        background: colors.ivory,
        color: colors.charcoal,
        fontFamily: "Noto Sans",
      }}
    >
      <div
        style={{
          width: WIDTH - PHOTO_WIDTH,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: rtl ? "flex-end" : "flex-start",
          padding: `56px ${PAD}px 48px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="40" height="40" viewBox="0 0 32 32">
            <path d="M3 13V3h10" stroke={colors.charcoal} strokeWidth="2.4" fill="none" />
            <path d="M29 19v10H19" stroke={colors.charcoal} strokeWidth="2.4" fill="none" />
            <rect x="9" y="9" width="14" height="14" fill={colors.orange} />
          </svg>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 7 }}>{siteConfig.name}</div>
        </div>

        {textless ? (
          <div style={{ display: "flex" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 17,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: colors.orangeInk,
              }}
            >
              <div style={{ width: 36, height: 2, background: colors.orange }} />
              {text.eyebrow}
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: title.length > 34 ? 56 : 66,
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: -2,
              }}
            >
              {title}
            </div>
            <div style={{ marginTop: 22, fontSize: 25, lineHeight: 1.4, color: colors.muted, maxWidth: 560 }}>
              {clip(text.subtitle, 140)}
            </div>
          </div>
        )}

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: rtl ? "row-reverse" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1.5px solid ${colors.line}`,
            paddingTop: 18,
            fontSize: 18,
            color: colors.muted,
          }}
        >
          <div style={{ display: "flex" }}>{textless ? "" : text.footer}</div>
          <div style={{ display: "flex", color: colors.charcoal, fontWeight: 600 }}>{host}</div>
        </div>
      </div>

      <div style={{ position: "relative", width: PHOTO_WIDTH, height: "100%", display: "flex" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to an image, not to the page */}
        <img src={photo} alt="" width={PHOTO_WIDTH} height={HEIGHT} style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 28, left: 28, display: "flex" }}>
          <Corner rotate={0} />
        </div>
        <div style={{ position: "absolute", top: 28, right: 28, display: "flex" }}>
          <Corner rotate={90} />
        </div>
        <div style={{ position: "absolute", bottom: 28, right: 28, display: "flex" }}>
          <Corner rotate={180} />
        </div>
        <div style={{ position: "absolute", bottom: 28, left: 28, display: "flex" }}>
          <Corner rotate={270} />
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, [rtl ? "right" : "left"]: 0, width: 10, background: colors.orange }} />
      </div>
    </div>
  );
}

const escapeMarkup = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Arabic text block rendered by sharp (Pango), with proper shaping, bidi and line breaking. */
async function arabicText(text: string, { size, weight, color, width, spacing }: {
  size: number;
  weight: "Regular" | "SemiBold";
  color: string;
  width: number;
  spacing: number;
}) {
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${color}">${escapeMarkup(text)}</span>`,
      font: `Noto Kufi Arabic ${weight === "SemiBold" ? "SemiBold " : ""}${size}`,
      fontfile: fontPath(`NotoKufiArabic-${weight}.ttf`),
      width,
      // Pango detects right-to-left text by itself; align the block to the right.
      align: "right",
      wrap: "word",
      spacing,
      rgba: true,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { input: data, width: info.width, height: info.height };
}

/** Lays the Arabic headline block into the empty space next to the photograph. */
async function arabicLayers(text: CardText) {
  const right = WIDTH - PAD;
  const width = WIDTH - PHOTO_WIDTH - PAD * 2;
  const title = Array.isArray(text.title) ? text.title.join("\n") : text.title;
  const [eyebrow, heading, subtitle, footer] = await Promise.all([
    arabicText(text.eyebrow, { size: 20, weight: "Regular", color: colors.orangeInk, width: width - 50, spacing: 0 }),
    arabicText(title, { size: title.length > 30 ? 46 : 54, weight: "SemiBold", color: colors.charcoal, width, spacing: -8 }),
    arabicText(clip(text.subtitle, 110), { size: 22, weight: "Regular", color: colors.muted, width: width - 10, spacing: -2 }),
    arabicText(text.footer, { size: 16, weight: "Regular", color: colors.muted, width: 400, spacing: 0 }),
  ]);

  const layers: Parameters<ReturnType<typeof sharp>["composite"]>[0] = [];
  let top = 168;
  layers.push({ input: eyebrow.input, top, left: right - 50 - eyebrow.width });
  layers.push({
    input: { create: { width: 36, height: 2, channels: 4, background: colors.orange } },
    top: top + Math.round(eyebrow.height / 2),
    left: right - 36,
  });
  top += eyebrow.height + 16;
  layers.push({ input: heading.input, top, left: right - heading.width });
  top += heading.height + 16;
  // Leave the subtitle out rather than run into the footer rule.
  if (top + subtitle.height <= 520) layers.push({ input: subtitle.input, top, left: right - subtitle.width });
  layers.push({ input: footer.input, top: 548 + Math.max(0, Math.round((26 - footer.height) / 2)), left: right - footer.width });
  return layers;
}

async function renderCard(text: CardText) {
  "use cache";
  cacheLife("max");

  const textless = text.language === "ar";
  const photo = await publicImage(text.image);
  const frame = new ImageResponse(<Card text={text} photo={photo} textless={textless} />, {
    ...shareCardSize,
    fonts: latinFonts,
  });
  let image = sharp(Buffer.from(await frame.arrayBuffer()));
  if (textless) image = sharp(await image.composite(await arabicLayers(text)).png().toBuffer());
  return new Uint8Array(await image.jpeg({ quality: 82, mozjpeg: true }).toBuffer());
}

export async function shareCard(text: CardText) {
  return new Response(await renderCard(text), { headers: { "Content-Type": "image/jpeg" } });
}
