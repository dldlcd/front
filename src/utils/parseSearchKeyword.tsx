// utils/parseSearchKeyword.ts

export function parseSearchKeyword(keyword: string) {
    const result: {
      gender?: string;
      style?: string[];
      season?: string[];
      tpo?: string;
    } = {};
  
    const lower = keyword.toLowerCase();
  
    // 🔹 Gender
    if (lower.includes("남성") || lower.includes("man")) result.gender = "male";
    else if (lower.includes("여성") || lower.includes("woman")) result.gender = "female";
  
    // 🔹 Style
    const styleMap = {
      캐주얼: "casual", 스포티: "sporty", 포멀: "formal", 미니멀: "minimal",
      오피스: "office", 스트릿: "street", 데이트: "date", 아메카지: "amercaji",
      유니크: "unique", 빈티지: "vintage", 러블리: "lovely", 시티보이: "cityboy", 레트로: "retro"
    };
    result.style = Object.entries(styleMap)
      .filter(([kor]) => lower.includes(kor))
      .map(([, eng]) => eng);
  
    // 🔹 Season
    if (lower.includes("봄")) result.season = ["spring"];
    if (lower.includes("여름")) result.season = ["summer"];
    if (lower.includes("가을")) result.season = ["fall"];
    if (lower.includes("겨울")) result.season = ["winter"];
  
    // 🔹 TPO
    const tpoMap = {
      데일리: "daily", 캠퍼스: "campus", 여행: "travel", 운동: "workout",
      출근: "work", 외출: "outing", 소개팅: "date"
    };
    for (const [kor, eng] of Object.entries(tpoMap)) {
      if (lower.includes(kor)) result.tpo = eng;
    }
  
    return result;
  }
  