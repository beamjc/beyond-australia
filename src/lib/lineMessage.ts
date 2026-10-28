// LINE URL scheme helpers (https://developers.line.biz/en/docs/messaging-api/using-line-url-scheme/,
// checked 2026-10-28). `oaMessage` opens the Official Account chat with the text in the input
// field; the visitor decides whether to send it. It works only in LINE for iOS/Android, not
// LINE for PC, so other devices keep the add-friend link.

export const LINE_OA_ID = "@beyondstudy";

export interface MessageLine {
  label: string;
  value: string;
}

export const formatLineMessage = (lines: MessageLine[]) =>
  lines.map((l) => `${l.label}: ${l.value}`).join("\n");

/** LINE ID and text are percent-encoded in UTF-8, as the LINE docs require. */
export const lineOAMessageUrl = (text: string, lineId: string = LINE_OA_ID) =>
  `https://line.me/R/oaMessage/${encodeURIComponent(lineId)}/?${encodeURIComponent(text)}`;

/** True on phones/tablets running iOS or Android, where the LINE URL scheme is supported. */
export const supportsLineUrlScheme = (userAgent: string, maxTouchPoints = 0) =>
  /Android|iPhone|iPad|iPod/i.test(userAgent) ||
  // iPadOS reports a desktop Safari user agent.
  (/Macintosh/.test(userAgent) && maxTouchPoints > 1);
