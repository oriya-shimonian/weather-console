import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./LocationsSearch.module.css";
import type { LocationsForNavbar } from "../../types/weather";

type Props = {
  options: LocationsForNavbar[];
  valueId: number | null;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export function LocationsSearch({ options, valueId, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selected = useMemo(
    () => options.find(o => +o.id === valueId) ?? null,
    [options, valueId]
  );

  // כשהתפריט סגור מציגים ערך נבחר; כשהוא פתוח - מציגים query
  const displayValue = useMemo(() => {
    if (open) return q;
    if (!selected) return "";
    return `${selected.city}, ${selected.country}`;
  }, [open, q, selected]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!open) return options;
    if (!query) return options;

    return options.filter(o => {
      const hay = `${o.city} ${o.country}`.toLowerCase();
      return hay.includes(query);
    });
  }, [options, q, open]);

  const openPanel = () => {
    if (disabled) return;
    setOpen(true);
    setQ(""); // פותחים עם חיפוש נקי
  };

  const closePanel = () => {
    setOpen(false);
    setQ("");
  };

  const choose = (id: number) => {
    onChange(id.toString());
    closePanel();
  };


  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) closePanel();
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
    }
    if (e.key === "Enter" && open) {
      e.preventDefault();
      if (filtered.length > 0) choose(+filtered[0].id);
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={`${styles.field} ${disabled ? styles.fieldDisabled : ""}`}>
        <span className={styles.icon} aria-hidden="true">🔎</span>

        <input
          ref={inputRef}
          name="location"
          className={styles.input}
          value={displayValue}
          placeholder={selected ? "" : "Search city or country…"}
          aria-label="Search locations"
          disabled={disabled}
          onFocus={openPanel}
          onClick={openPanel}
          onChange={(e) => {
            if (!open) setOpen(true);
            setQ(e.target.value);
          }}
          onKeyDown={onKeyDownInput}
        />
      </div>

      {open && (
        <div className={styles.panel} role="listbox" aria-label="Locations">
          {filtered.length === 0 ? (
            <div className={styles.empty}>No results</div>
          ) : (
            filtered.map((o) => {
              const active = +o.id === valueId;
              return (
                <button
                  key={+o.id}
                  type="button"
                  className={`${styles.item} ${active ? styles.itemActive : ""}`}
                  onClick={() => choose(+o.id)}
                  role="option"
                  aria-selected={active}
                >
                  <span className={styles.itemMain}>{o.city}</span>
                  <span className={styles.itemSub}>{o.country}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
