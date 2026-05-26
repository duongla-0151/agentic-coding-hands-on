import sanitizeHtml from "sanitize-html";
import type { KudosPost, UserInfo } from "./types";

const ALLOWED_TAGS = ["b", "i", "s", "ol", "ul", "li", "blockquote", "a", "br", "p"];
const ALLOWED_ATTRS: Record<string, string[]> = { a: ["href"] };

function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRS,
    allowedSchemes: ["https", "http"],
  });
}

interface RawKudos {
  id: string;
  sender_id: string | null;
  recipient_id: string;
  anonymous_name: string | null;
  badge: string;
  content: string;
  hashtags: string[];
  images: string[];
  created_at: string;
}

interface EnrichOptions {
  userMap: Map<string, UserInfo>;
  /** kudos_id → like count */
  likeCountMap: Map<string, number>;
  /** set of kudos_ids liked by the current user */
  likedByMe: Set<string>;
  /** recipient_id → total kudos received */
  recipientCountMap: Map<string, number>;
}

const UNKNOWN_USER: UserInfo = { id: "", name: "Ẩn danh", avatar: null };

export function enrichKudos(raw: RawKudos, opts: EnrichOptions): KudosPost {
  const { userMap, likeCountMap, likedByMe, recipientCountMap } = opts;

  const recipient = userMap.get(raw.recipient_id) ?? { ...UNKNOWN_USER, id: raw.recipient_id };
  const sender = raw.sender_id ? (userMap.get(raw.sender_id) ?? { ...UNKNOWN_USER, id: raw.sender_id }) : null;

  return {
    id: raw.id,
    sender,
    anonymous_name: raw.anonymous_name,
    recipient,
    badge: raw.badge,
    content: sanitizeContent(raw.content),
    hashtags: raw.hashtags,
    images: raw.images,
    created_at: raw.created_at,
    like_count: likeCountMap.get(raw.id) ?? 0,
    liked_by_me: likedByMe.has(raw.id),
    recipient_kudos_count: recipientCountMap.get(raw.recipient_id) ?? 0,
  };
}

/** Build like maps from a flat list of like rows */
export function buildLikeMaps(
  likes: { kudos_id: string; user_id: string }[],
  currentUserId: string | null
): { likeCountMap: Map<string, number>; likedByMe: Set<string> } {
  const likeCountMap = new Map<string, number>();
  const likedByMe = new Set<string>();
  for (const l of likes) {
    likeCountMap.set(l.kudos_id, (likeCountMap.get(l.kudos_id) ?? 0) + 1);
    if (currentUserId && l.user_id === currentUserId) likedByMe.add(l.kudos_id);
  }
  return { likeCountMap, likedByMe };
}

/** Build recipient kudos-received count map */
export function buildRecipientCountMap(
  rows: { recipient_id: string }[]
): Map<string, number> {
  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.recipient_id, (map.get(r.recipient_id) ?? 0) + 1);
  }
  return map;
}
