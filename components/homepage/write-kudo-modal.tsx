"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { KudoRichEditor } from "./kudo-rich-editor";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const INPUT: React.CSSProperties = {
  fontFamily: FONT, fontSize: 14, color: "#00101A",
  border: "1px solid #998C5F", borderRadius: 8, height: 56,
  padding: "0 16px", outline: "none", background: "#fff",
  width: "100%", boxSizing: "border-box",
};
const ERR_BORDER = "1px solid #D32F2F";
const LABEL_STYLE: React.CSSProperties = {
  fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#00101A", whiteSpace: "nowrap",
};

interface UserResult { id: string; name: string; email: string; }
type TouchedFields = { recipient: boolean; badge: boolean; content: boolean; hashtag: boolean };

export function WriteKudoModal({ onClose }: { onClose: () => void }) {
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [badge, setBadge] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonName, setAnonName] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [showDrop, setShowDrop] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<TouchedFields>({ recipient: false, badge: false, content: false, hashtag: false });
  const fileRef = useRef<HTMLInputElement>(null);
  const previewsRef = useRef<string[]>([]);

  useEffect(() => { previewsRef.current = previews; }, [previews]);
  useEffect(() => () => { previewsRef.current.forEach(URL.revokeObjectURL); }, []);

  useEffect(() => {
    if (!recipientName || recipientId) { setUsers([]); return; }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(recipientName)}`, { signal: controller.signal });
        const data: UserResult[] = await res.json();
        setUsers(data);
        setShowDrop(data.length > 0);
      } catch { /* aborted */ }
    }, 300);
    return () => { clearTimeout(t); controller.abort(); };
  }, [recipientName, recipientId]);

  function touch(field: keyof TouchedFields) {
    setTouched((p) => ({ ...p, [field]: true }));
  }

  function addTag() {
    const tag = tagInput.trim().replace(/^#/, "").toLowerCase();
    if (!tag || hashtags.includes(tag) || hashtags.length >= 5) return;
    setHashtags((p) => [...p, tag]);
    setTagInput("");
  }

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - images.length);
    setImages((p) => [...p, ...files]);
    setPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  }

  function removeImage(i: number) {
    URL.revokeObjectURL(previews[i]);
    setImages((p) => p.filter((_, j) => j !== i));
    setPreviews((p) => p.filter((_, j) => j !== i));
  }

  function sanitizeContent(html: string): string {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    tmp.querySelectorAll("script,style").forEach((el) => el.remove());
    tmp.querySelectorAll("*").forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.startsWith("on")) el.removeAttribute(attr.name);
        if (attr.name === "href" && !/^https?:\/\//i.test(attr.value)) el.removeAttribute(attr.name);
      });
    });
    return tmp.innerHTML;
  }

  const contentText = (() => {
    if (typeof document === "undefined") return "";
    const t = document.createElement("div");
    t.innerHTML = content;
    return t.textContent?.trim() ?? "";
  })();

  const validations = {
    recipient: !!recipientId,
    badge: badge.trim().length > 0,
    content: contentText.length > 0,
    hashtag: hashtags.length > 0,
  };
  const canSubmit = Object.values(validations).every(Boolean);

  async function handleSubmit() {
    if (!canSubmit) {
      setTouched({ recipient: true, badge: true, content: true, hashtag: true });
      return;
    }
    setSubmitting(true); setError("");
    const supabase = createClient();
    const uploadedPaths: string[] = [];
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Bạn cần đăng nhập để gửi Kudos");
      const imageUrls: string[] = [];
      for (const file of images) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { data, error: upErr } = await supabase.storage.from("kudo-images").upload(path, file);
        if (upErr) throw upErr;
        uploadedPaths.push(data.path);
        const { data: { publicUrl } } = supabase.storage.from("kudo-images").getPublicUrl(data.path);
        imageUrls.push(publicUrl);
      }
      const { error: insErr } = await supabase.from("kudos").insert({
        recipient_id: recipientId,
        sender_id: isAnonymous ? null : user.id,
        anonymous_name: isAnonymous ? (anonName || null) : null,
        badge, content: sanitizeContent(content), hashtags, images: imageUrls,
      });
      if (insErr) throw insErr;
      onClose();
    } catch (e) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from("kudo-images").remove(uploadedPaths);
      }
      setError(e instanceof Error ? e.message : "Đã có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  }

  const showErr = (field: keyof TouchedFields) => touched[field] && !validations[field];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog" aria-modal="true" aria-label="Viết Kudos"
        style={{
          width: "min(752px, 95vw)", maxHeight: "90vh", overflowY: "auto",
          background: "rgba(255,248,225,1)", borderRadius: 24, padding: 40,
          display: "flex", flexDirection: "column", gap: 32,
        }}
      >
        {/* Title */}
        <h2 style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: "#00101A", textAlign: "center", margin: 0 }}>
          Gửi lời cám ơn và ghi nhận đến đồng đội
        </h2>

        {/* Recipient */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
            <span style={LABEL_STYLE}>
              Người nhận<span style={{ color: "#D32F2F" }}>*</span>
            </span>
            <div style={{ flex: 1, position: "relative" }}>
              {/* Composite search input with chevron */}
              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  border: showErr("recipient") ? ERR_BORDER : "1px solid #998C5F",
                  borderRadius: 8, height: 56, background: "#fff",
                  padding: "0 16px 0 16px", boxSizing: "border-box",
                }}
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={recipientName}
                  onChange={(e) => { setRecipientName(e.target.value); setRecipientId(""); }}
                  onFocus={() => users.length > 0 && setShowDrop(true)}
                  onBlur={() => { setTimeout(() => setShowDrop(false), 150); touch("recipient"); }}
                  style={{
                    fontFamily: FONT, fontSize: 14, color: "#00101A",
                    border: "none", outline: "none", background: "transparent", flex: 1,
                  }}
                />
                <span style={{ color: "#998C5F", fontSize: 16, pointerEvents: "none" }}>▾</span>
              </div>
              {showDrop && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 10,
                  background: "#fff", border: "1px solid #998C5F", borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)", overflow: "hidden",
                }}>
                  {users.map((u) => (
                    <div
                      key={u.id}
                      onMouseDown={() => { setRecipientId(u.id); setRecipientName(u.name); setShowDrop(false); }}
                      style={{ fontFamily: FONT, fontSize: 14, padding: "10px 16px", cursor: "pointer", color: "#00101A" }}
                      className="hover:bg-[#FFF8E1]"
                    >
                      {u.name}
                      {u.email && <span style={{ color: "#998C5F", fontSize: 12, marginLeft: 8 }}>{u.email}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {showErr("recipient") && (
            <p style={{ fontFamily: FONT, fontSize: 12, color: "#D32F2F", margin: 0, paddingLeft: 4 }}>
              Vui lòng chọn người nhận
            </p>
          )}
        </div>

        {/* Badge */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={LABEL_STYLE}>
              Danh hiệu<span style={{ color: "#D32F2F" }}>*</span>
            </span>
            <input
              type="text"
              placeholder="Dành tặng một danh hiệu cho đồng đội"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              onBlur={() => touch("badge")}
              style={{
                ...INPUT, flex: 1, width: "auto",
                border: showErr("badge") ? ERR_BORDER : INPUT.border,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 4 }}>
            <p style={{ fontFamily: FONT, fontSize: 12, color: "rgba(0,16,26,0.5)", margin: 0 }}>
              Ví dụ: Người truyền động lực cho tôi.
            </p>
            <p style={{ fontFamily: FONT, fontSize: 12, color: "rgba(0,16,26,0.5)", margin: 0 }}>
              Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.
            </p>
          </div>
          {showErr("badge") && (
            <p style={{ fontFamily: FONT, fontSize: 12, color: "#D32F2F", margin: 0, paddingLeft: 4 }}>
              Vui lòng nhập danh hiệu
            </p>
          )}
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Rich editor */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ border: showErr("content") ? "1px solid #D32F2F" : "none", borderRadius: 8 }}>
              <KudoRichEditor onChange={setContent} onBlur={() => touch("content")} />
            </div>
            <p style={{ fontFamily: FONT, fontSize: 12, color: "rgba(0,16,26,0.5)", margin: 0 }}>
              Bạn có thể &ldquo;@ + tên&rdquo; để nhắc tới đồng nghiệp khác
            </p>
            {showErr("content") && (
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#D32F2F", margin: 0 }}>
                Vui lòng nhập nội dung
              </p>
            )}
          </div>

          {/* Hashtags — row layout: label left, chips right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ minWidth: 108 }}>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#00101A" }}>
                  Hashtag<span style={{ color: "#D32F2F" }}>*</span>
                </span>
                <span style={{ fontFamily: FONT, fontSize: 11, color: "#998C5F", display: "block" }}>Tối đa 5</span>
              </div>
              <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: FONT, fontSize: 13, color: "#00101A",
                      background: "rgba(255,234,158,0.4)", border: "1px solid #998C5F",
                      borderRadius: 999, padding: "4px 12px",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setHashtags((p) => p.filter((t) => t !== tag))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#998C5F", padding: 0, lineHeight: 1, fontSize: 16 }}
                    >×</button>
                  </span>
                ))}
                {hashtags.length < 5 && (
                  <input
                    type="text"
                    placeholder="+ Hashtag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                    onBlur={() => { addTag(); touch("hashtag"); }}
                    style={{
                      fontFamily: FONT, fontSize: 13, color: "#00101A",
                      border: showErr("hashtag") ? ERR_BORDER : "1px solid #998C5F",
                      borderRadius: 999, padding: "4px 12px",
                      outline: "none", background: "transparent", width: 120,
                    }}
                  />
                )}
              </div>
            </div>
            {showErr("hashtag") && (
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#D32F2F", margin: 0 }}>
                Vui lòng thêm ít nhất 1 hashtag
              </p>
            )}
          </div>

          {/* Images — row layout: label left, thumbnails right */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#00101A", minWidth: 74, paddingTop: 4 }}>
              Image
            </span>
            <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    style={{
                      position: "absolute", top: -6, right: -6, width: 20, height: 20,
                      borderRadius: "50%", background: "#D32F2F", border: "none", cursor: "pointer",
                      color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >×</button>
                </div>
              ))}
              {images.length < 5 && (
                <>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      fontFamily: FONT, fontSize: 12, color: "#00101A",
                      border: "1px solid #998C5F", borderRadius: 8, padding: "8px 16px",
                      background: "transparent", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    }}
                  >
                    + Image
                    <span style={{ fontSize: 10, color: "#998C5F" }}>Tối đa 5</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png" multiple hidden onChange={handleImages} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Anonymous */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "#FFEA9E", cursor: "pointer" }}
            />
            <span style={{ fontFamily: FONT, fontSize: 14, color: "#00101A" }}>Gửi lời cám ơn và ghi nhận ẩn danh</span>
          </label>
          {isAnonymous && (
            <input
              type="text"
              placeholder="Tên hiển thị (tùy chọn)"
              value={anonName}
              onChange={(e) => setAnonName(e.target.value)}
              style={INPUT}
            />
          )}
        </div>

        {error && <p style={{ fontFamily: FONT, fontSize: 13, color: "#D32F2F", margin: 0 }}>{error}</p>}

        {/* Footer */}
        <div style={{ display: "flex", gap: 24 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#00101A",
              border: "1px solid #998C5F", background: "rgba(255,234,158,0.10)",
              borderRadius: 4, padding: "16px 40px", cursor: "pointer",
            }}
          >
            Hủy ✕
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#00101A",
              background: "#FFEA9E", borderRadius: 8, border: "none", padding: 16, flex: 1,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.5 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {submitting ? "Đang gửi..." : "Gửi ▷"}
          </button>
        </div>
      </div>
    </div>
  );
}
