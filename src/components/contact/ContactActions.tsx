import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { mailtoLink, telLink, whatsAppLink } from "@/lib/contact";

/**
 * Direct contact channels for the active market. Channels without a
 * configured number are hidden (`compact`) or shown as "to be confirmed"
 * (`panel`) — a number is never invented.
 *
 * WhatsApp messages may mention a service or emirate, never personal data.
 */
export async function ContactActions({
  variant = "panel",
  whatsappMessage,
}: {
  variant?: "panel" | "compact";
  whatsappMessage?: string;
}) {
  const { dict, market } = await getI18n();
  const t = dict.contactPage;
  const { contact } = market;
  const whatsapp = whatsAppLink(contact.whatsapp, whatsappMessage ?? t.whatsappMessage);
  const tel = telLink(contact.phone);
  const mail = mailtoLink(contact.email);

  const channels = [
    {
      key: "whatsapp",
      label: t.whatsapp,
      href: whatsapp,
      detail: contact.whatsapp,
      note: t.leaving,
      external: true,
      Icon: MessageCircle,
    },
    { key: "call", label: t.call, href: tel, detail: contact.phone, note: null, external: false, Icon: Phone },
    { key: "email", label: t.email, href: mail, detail: contact.email, note: null, external: false, Icon: Mail },
  ];

  if (variant === "compact") {
    const available = channels.filter((channel) => channel.href);
    if (available.length === 0) return null;
    return (
      <ul className="flex flex-wrap gap-2">
        {available.map(({ key, label, href, note, external, Icon }) => (
          <li key={key}>
            <a
              href={href!}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="btn btn-ghost-dark min-h-11 px-4 text-sm"
              title={note ?? undefined}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
              {external && <span className="sr-only">{dict.common.opensNewTab}</span>}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="divide-y divide-line-inverse border-y border-line-inverse">
      {channels.map(({ key, label, href, detail, note, external, Icon }) => (
        <li key={key} className="py-4">
          {href ? (
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-start justify-between gap-4"
            >
              <span className="flex items-start gap-3">
                <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                <span>
                  <span className="block font-medium">{label}</span>
                  {detail && <span className="ltr-isolate block text-sm text-ivory/70">{detail}</span>}
                  {note && <span className="block text-xs text-ivory/60">{note}</span>}
                  {external && <span className="sr-only">{dict.common.opensNewTab}</span>}
                </span>
              </span>
              <ArrowUpRight aria-hidden="true" className="icon-dir h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100" />
            </a>
          ) : (
            <span className="flex items-start gap-3 text-ivory/60">
              <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="block font-medium text-ivory/80">{label}</span>
                <span className="block text-sm">{t.notConfigured}</span>
              </span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
