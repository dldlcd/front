import React from "react";

interface FilterButtonProps {
  onClick: () => void;
  count?: number; // 선택된 필터 수
}

export default function FilterButton({ onClick, count = 0 }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-1 text-blue-500 hover:text-blue-700"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
      <span className="text-sm font-semibold">{count}</span>
    </button>
  );
}
