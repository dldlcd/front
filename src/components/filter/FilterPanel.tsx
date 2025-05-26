import React, { useState } from "react";
import classNames from "classnames";

const SEASONS = 
[{ id: "spring", label: "봄 🌱" },
  { id: "summer", label: "여름 🌞" },
  { id: "fall", label: "가을 🍂" },
  { id: "winter", label: "겨울 ❄️" }];
const GENDERS = [{ id: "male", label: "남" }, { id: "female", label: "여" }];
const TPOS = 
[{ id: "daily", label: "데일리 🏖️" },
  { id: "campus", label: "캠퍼스 🎓" },
  { id: "date", label: "데이트 💄" },
  { id: "work", label: "출근 👜" },
  { id: "travel", label: "여행 🚗" },
  { id: "outing", label: "가벼운 외출 👰" },
  { id: "workout", label: "운동 🧦" }];
const MOODS = [
  { id: 'casual', label: '캐주얼' },
  { id: 'sporty', label: '스포티' },
  { id: 'formal', label: '포멀' },
  { id: 'minimal', label: '미니멀' },
  { id: 'office', label: '오피스' },
  { id: 'street', label: '스트릿' },
  { id: 'date', label: '데이트' },
  { id: 'amercaji', label: '아메카지' },
  { id: 'unique', label: '유니크' },
  { id: 'vintage', label: '빈티지' },
  { id: 'lovely', label: '러블리' },
  { id: 'cityboy', label: '시티보이' },
  { id: 'retro', label: '레트로' }
];

interface FilterPanelProps {
  onApply: (filters: {
    style: string[];
    gender: string;
    season: string[];
    tpo: string;
  }) => void;
  onClose: () => void;
  selectedStyles: string[];
}

export default function FilterPanel({ onApply, onClose, selectedStyles }: FilterPanelProps) {
  const [gender, setGender] = useState<string>("");
  const [season, setSeason] = useState<string[]>([]);
  const [tpo, setTpo] = useState("");
  const [mood, setMood] = useState<string[]>(selectedStyles || []);
 
 
  

  const handleReset = () => {
    setGender("");     // ✅ 빈 문자열로 초기화
    setSeason([]);     // ✅ 여러 개 선택 가능하므로 배열
    setTpo("");        // ✅ 단일 선택이므로 빈 문자열
    setMood([]);       // ✅ 배열
  };

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const itemClass = (active: boolean) =>
    classNames(
      "flex items-center gap-3 py-2 transition-all duration-200",
      {
        "text-blue-600": active,
        "text-gray-600 hover:text-gray-700": !active,
      }
    );

  const checkboxIcon = (active: boolean) =>
    classNames(
      "w-5 h-5 rounded-full flex items-center justify-center",
      {
        "bg-blue-500 text-white": active,
        "bg-gray-200 text-gray-400": !active,
      }
    );

  return (
    <div className="w-full min-h-screen bg-white flex flex-col border border-gray-200 max-w-[650px] mx-auto shadow-lg rounded-xl">
      {/* 상단 바 */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm px-4 py-4 flex justify-between items-center">
       
        
        <button onClick={onClose} className="text-xl">✕</button>
        <h2 className="text-xl font-bold">필터</h2>
        <button
          onClick={handleReset}
          className=" py-3 rounded-full  transition-colors"
        >
          초기화
        </button>
        
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        
        {/* Gender */}
        <section>
          <h3 className="text-sm font-semibold mb-2 text-gray-500">GENDER</h3>
          <div className="flex flex-col gap-4">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              className={itemClass(gender === g.id)}
              onClick={() => setGender(gender === g.id ? "" : g.id)}
            >
              <div className={checkboxIcon(gender === g.id)}>
                {gender === g.id ? '✓' : ''}
              </div>
              <span>{g.label}</span>
            </button>
          ))}
          </div>
        </section>

        

        {/* TPO */}
        <section>
          <h3 className="text-sm font-semibold mb-2 text-gray-500">TPO</h3>
          <div className="grid grid-cols-4 gap-2">
            {TPOS.map((t) => (
              <button
                key={t.id}
                className={itemClass(tpo === t.id)}
                onClick={() => setTpo(t.id)}
              >
                <div className={checkboxIcon(tpo === t.id)}>
                  {tpo === t.id ? '✓' : ''}
                </div>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Season */}
        <section>
          <h3 className="text-sm font-semibold mb-2 text-gray-500">SEASON</h3>
          <div className="grid grid-cols-4 gap-2">
          {SEASONS.map((s) => (
            <button
              key={s.id}
              className={itemClass(season.includes(s.id))}
              onClick={() => setSeason(toggle(season, s.id))}
            >
              <div className={checkboxIcon(season.includes(s.id))}>
                {season.includes(s.id) ? '✓' : ''}
              </div>
              <span>{s.label}</span>
            </button>
          ))}
          </div>
        </section>

        {/* Mood */}
        <section>
          <h3 className="text-sm font-semibold mb-2 text-gray-500">MOOD</h3>
          <div className="grid grid-cols-3 gap-4">
            {MOODS.map((m) => (
              <button
              key={m.id}
                className={itemClass(mood.includes(m.id))}
                onClick={() => setMood(toggle(mood, m.id))}
              >
                <div className={checkboxIcon(mood.includes(m.id))}>
                  {mood.includes(m.id) ? '✓' : ''}
                </div>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 z-50 bg-white border-t px-4 py-4 shadow-t">
        <button
          onClick={() =>
            onApply({
              style: mood,
              gender,
              season,
              tpo
            })
          }
          className="w-full py-3 rounded-full bg-gradient-to-r from-black to-blue-50 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors"
        >
          스타일 보기
        </button>
      </div>
    </div>
  );
}
