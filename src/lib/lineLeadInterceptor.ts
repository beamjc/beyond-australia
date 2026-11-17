// One click handler for every "chat with @beyondstudy on LINE" link on the site.
//
// When the LIFF lead form is configured and the visitor has used at least one
// tool this visit, the click opens the form with all of their answers. In every
// other case (no LIFF ID, no answers, modified click, share links) the link
// behaves exactly as before. This avoids touching each LINE button.

import { liffEnabled, openLiffWithDraft } from "./leadDraft";
import { buildLeadDraft } from "./visitorAnswers";

/** Add-friend and chat links for the Beyond Study Center OA, not share links. */
export const isOfficialAccountLink = (href: string) =>
  /^https:\/\/line\.me\/(R\/)?(ti\/p\/@|oaMessage\/%40)beyondstudy(\/|$|\?)/i.test(href);

export function installLineLeadInterceptor(): () => void {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || !isOfficialAccountLink(a.href) || !liffEnabled()) return;
    if (window.location.pathname.startsWith("/line")) return; // the LIFF page itself
    const draft = buildLeadDraft();
    if (!draft) return; // nothing entered yet: keep the normal chat link
    e.preventDefault();
    void openLiffWithDraft(draft, a.href);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
