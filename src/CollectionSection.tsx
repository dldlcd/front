import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Outfit {
  id: number;
  imageUrl: string; 
  description: string;
  likes: number;
  style?: string;
  situation?: string;
  season?: string;
  type?: string;
}

interface CollectionSectionProps {
  className?: string;
}



const itemsPerPage = 4;

export default function CollectionSection({ className }: CollectionSectionProps) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("🔵 비로그인 상태: 기본 이미지 보여줌");
      return; // 로그인 안 되어 있으면 fetch 시도 안 함
    }

    fetch("https://looksy.p-e.kr/api/auth/mypage", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("불러오기 실패");
        return res.json();
      })
      .then((data) => {
        console.log("✅ 로그인 상태: outfits 데이터 수신", data);
        setOutfits(data);
      })
      .catch((err) => {
        console.error("추천 데이터 불러오는 중 오류 발생:", err);
        // 실패 시 기본 이미지 유지
      });
  }, []);

  return (
    <section className={`w-full max-w-[1600px] mx-auto py-8 ${className || ""}`}>
      {outfits.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-16 text-center text-gray-400">
            <svg
              className="h-16 w-16 mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7l9 6 9-6M4 19h16M4 15h16"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-500 mb-2">게시물이 없습니다</h2>
            <p className="text-sm text-gray-400">
              나만의 첫 코디를 등록해보세요 ✨
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6 mb-8">
          {outfits.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((outfit) => (
            <Card
              key={outfit.id}
              className="border border-solid border-[#d6d6d6] rounded-none"
            >
              <CardContent className="p-0 relative">
                <div className="relative">
                  <img
                    onClick={() => navigate(`/outfit/${outfit.id}`)}
                    src={outfit.imageUrl}
                    alt={outfit.description}
                    className="w-full h-[313px] object-cover"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    {[outfit.style, outfit.situation, outfit.season].filter(Boolean).map((tag, idx, arr) => (
                      <span key={tag} className="text-blue-500 text-sm">
                        #{tag}{idx < arr.length - 1 && ' '}
                      </span>
                    ))}
                  </div>
                  <div className="font-medium text-[#000000a8] text-xs truncate">
                    {outfit.type}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}