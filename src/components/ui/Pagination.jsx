import React, { useMemo } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) {
  const total = Math.max(0, Number(totalPages) || 0);
  const current = Math.max(1, Number(currentPage) || 1);

  const pages = useMemo(() => {
    if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);

    const res = [1];
    const left = Math.max(2, current - 2);
    const right = Math.min(total - 1, current + 2);
    if (left > 2) res.push("...");
    for (let i = left; i <= right; i++) res.push(i);
    if (right < total - 1) res.push("...");
    res.push(total);
    return res;
  }, [total, current]);

  const outlinedBtn = (content, key, opts = {}) => {
    const { active = false, disabled = false, onClick } = opts;
    const base = "px-3 py-1 rounded-md border text-sm font-medium";
    const activeCls = "bg-white border-gray-500 text-black";
    const inactiveCls = "bg-transparent border-gray-500 text-black hover:bg-gray-400";
    const disabledCls = "opacity-50 cursor-not-allowed";

    return (
      <button
        key={key}
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${active ? activeCls : inactiveCls} ${disabled ? disabledCls : ""}`}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="inline-flex items-center gap-2">
        {outlinedBtn("Prev", "prev", { disabled: current <= 1, onClick: () => current > 1 && onPageChange(current - 1) })}

        {pages.map((p, idx) =>
          p === "..."
            ? (
              <span key={`ell-${idx}`} className="px-3 py-1 text-black">...</span>
            )
            : outlinedBtn(p, `p-${p}`, { active: p === current, onClick: () => onPageChange(p) })
        )}

        {outlinedBtn("Next", "next", { disabled: current >= total, onClick: () => current < total && onPageChange(current + 1) })}
      </div>

      <div>
        <select
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          className="bg-transparent border border-gray-500 text-black rounded px-2 py-1 text-sm"
        >
          <option className="bg-gray-900 text-gray-400" value={10}>10</option>
          <option className="bg-gray-900 text-gray-400" value={15}>15</option>
          <option className="bg-gray-900 text-gray-400" value={20}>20</option>
        </select>
      </div>
    </div>
  );
}
