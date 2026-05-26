"use client";

import { useState } from "react";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface FilterBarProps {
  hashtags: string[];
  selected: string | null;
  onSelect: (h: string | null) => void;
  departments?: string[];
  selectedDepartment?: string | null;
  onDepartmentSelect?: (d: string | null) => void;
}

const DROPDOWN_STYLE: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  zIndex: 20,
  background: "#0D1F2D",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 12,
  overflow: "hidden",
  minWidth: 180,
  maxHeight: 280,
  overflowY: "auto",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
};

const ITEM_BASE: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 13,
  padding: "10px 16px",
  cursor: "pointer",
};

export function FilterBar({
  hashtags,
  selected,
  onSelect,
  departments = [],
  selectedDepartment = null,
  onDepartmentSelect,
}: FilterBarProps) {
  const [hashOpen, setHashOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);

  function toggleHashtag(tag: string) {
    onSelect(selected === tag ? null : tag);
    setHashOpen(false);
  }

  function toggleDept(dept: string) {
    onDepartmentSelect?.(selectedDepartment === dept ? null : dept);
    setDeptOpen(false);
  }

  function btnStyle(active: boolean): React.CSSProperties {
    return {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: FONT,
      fontSize: 14,
      fontWeight: 600,
      color: active ? "#00101A" : "#fff",
      background: active ? "#FFEA9E" : "rgba(255,234,158,0.10)",
      border: "1px solid #998C5F",
      borderRadius: 4,
      padding: "16px",
      cursor: "pointer",
      whiteSpace: "nowrap",
    };
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>

      {/* Hashtag dropdown */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => { setHashOpen(v => !v); setDeptOpen(false); }}
          style={btnStyle(!!selected)}
          aria-haspopup="listbox"
          aria-expanded={hashOpen}
        >
          <span>{selected ? `#${selected}` : "Hashtag"}</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>▾</span>
        </button>

        {hashOpen && (
          <div style={DROPDOWN_STYLE} role="listbox">
            {selected && (
              <div
                role="option"
                aria-selected={false}
                onClick={() => { onSelect(null); setHashOpen(false); }}
                style={{ ...ITEM_BASE, color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = ""; }}
              >
                Xóa bộ lọc
              </div>
            )}
            {hashtags.length === 0 ? (
              <div style={{ ...ITEM_BASE, color: "rgba(255,255,255,0.4)" }}>Chưa có hashtag</div>
            ) : (
              hashtags.map((tag) => (
                <div
                  key={tag}
                  role="option"
                  aria-selected={selected === tag}
                  onClick={() => toggleHashtag(tag)}
                  style={{ ...ITEM_BASE, color: selected === tag ? "#FFEA9E" : "#fff", background: selected === tag ? "rgba(255,234,158,0.1)" : "transparent" }}
                  onMouseEnter={(e) => { if (selected !== tag) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={(e) => { if (selected !== tag) (e.currentTarget as HTMLDivElement).style.background = selected === tag ? "rgba(255,234,158,0.1)" : "transparent"; }}
                >
                  #{tag}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Phòng ban dropdown */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => { setDeptOpen(v => !v); setHashOpen(false); }}
          style={btnStyle(!!selectedDepartment)}
          aria-haspopup="listbox"
          aria-expanded={deptOpen}
        >
          <span>{selectedDepartment || "Phòng ban"}</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>▾</span>
        </button>

        {deptOpen && (
          <div style={DROPDOWN_STYLE} role="listbox">
            {selectedDepartment && (
              <div
                role="option"
                aria-selected={false}
                onClick={() => { onDepartmentSelect?.(null); setDeptOpen(false); }}
                style={{ ...ITEM_BASE, color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = ""; }}
              >
                Xóa bộ lọc
              </div>
            )}
            {departments.length === 0 ? (
              <div style={{ ...ITEM_BASE, color: "rgba(255,255,255,0.4)" }}>Chưa có dữ liệu</div>
            ) : (
              departments.map((dept) => (
                <div
                  key={dept}
                  role="option"
                  aria-selected={selectedDepartment === dept}
                  onClick={() => toggleDept(dept)}
                  style={{ ...ITEM_BASE, color: selectedDepartment === dept ? "#FFEA9E" : "#fff", background: selectedDepartment === dept ? "rgba(255,234,158,0.1)" : "transparent" }}
                  onMouseEnter={(e) => { if (selectedDepartment !== dept) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={(e) => { if (selectedDepartment !== dept) (e.currentTarget as HTMLDivElement).style.background = selectedDepartment === dept ? "rgba(255,234,158,0.1)" : "transparent"; }}
                >
                  {dept}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Close dropdowns on outside click */}
      {(hashOpen || deptOpen) && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 10 }}
          onClick={() => { setHashOpen(false); setDeptOpen(false); }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
