import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Heart, HeartOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";



interface Outfit {
  id: number;
  imageUrl: string; 
  description: string;
  likes: number;
  type: string;
  liked: boolean;
  
}



interface Outfit {
  id: number
  title: string;
  description: string;
  imageUrl: string;
  color: string;
  season: string;
  situation: string;
  style: string;
  likes: number;
  liked: boolean;
  userId: number;
  userNickname: string;
  userProfileImage: string;
  bookmarked: boolean;
}



export default function DesignApproachSection(): React.JSX.Element {
  // Product data for "NEW THIS WEEK" section

  const [weatherOutfits, setWeatherOutfits] = useState<Outfit[]>([]);
  
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState<Outfit[]>([]);

  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(outfits.length / itemsPerPage);

const getWeatherTags = (_weather: string, _temp: number) => {
  return {
    styles: ["캐주얼"],
    tpo: ["데일리"],
  };
};




  const fetchOutfits = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch("https://looksy.p-e.kr/api/outfits/this-month", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }), // ✅ 토큰 있으면 Authorization 추가
        },
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("불러오기 실패");
  
      const data = await res.json();
      setOutfits(data);
    } catch (error) {
      console.error("outfits 불러오는 중 오류 발생:", error);
    }
  };
  

  const toggleLike = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다");
      return;
    }

    try {
      const res = await fetch(`https://looksy.p-e.kr/api/auth/like/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("좋아요 토글 실패");

      await res.json(); 
      fetchOutfits();   
    } catch (error) {
      console.error("좋아요 토글 에러:", error);
    }
  };

  

//_-------------------------------------------------------------------------------------- 추천 코디
    const fetchRecommendedOutfits = async () => {
  const token = localStorage.getItem("token");
  let tags = null;

  // 1. 로그인 했으면 추천 태그 가져오기
  if (token) {
    try {
      const res = await fetch("https://looksy.p-e.kr/api/searchlog/recommend", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        tags = await res.json();
      }
    } catch (err) {
      console.error("추천 태그 불러오기 실패:", err);
    }
  }

  // 2. 로그인 안했거나 추천 없음 → popular fallback
  if (!tags || (!tags.styles?.length && !tags.tpo?.length)) {
    try {
      const res = await fetch("https://looksy.p-e.kr/api/searchlog/popular");
      if (res.ok) {
        tags = await res.json();
        console.log("Fallback으로 인기 태그 사용 중", tags);
      }
    } catch (err) {
      console.error("인기 태그 불러오기 실패:", err);
      return;
    }
  }

  // 3. 태그를 기반으로 outfit 요청
  const params = new URLSearchParams();

  if (Array.isArray(tags.styles)) {
    tags.styles.forEach((s: string) => params.append("style", s));
  }

  if (Array.isArray(tags.tpo)) {
    tags.tpo.forEach((t: string) => params.append("tpo", t));
  } else if (typeof tags.tpo === "string") {
    params.append("tpo", tags.tpo);
  }


  try {
    const outfitRes = await fetch(`https://looksy.p-e.kr/api/outfits?${params.toString()}&size=12`);

    if (!outfitRes.ok) throw new Error("추천 outfit 불러오기 실패");

    const outfitData = await outfitRes.json();
    setRecommended(outfitData);
  } catch (error) {
    console.error("추천 outfit 불러오기 오류:", error);
  }
};

const fetchWeatherAndOutfits = async () => {
  try {
    console.log("🟡 날씨 코디 요청 시작");

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("📍 위치 확인:", latitude, longitude);

      const apiKey = "1f434c0648ea58886e4a60d96cead37e"; // 본인 키

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherRes.json();
      console.log("🌦 날씨 응답:", weatherData);

      const weather = weatherData.weather[0].main;
      const temp = weatherData.main.temp;

      const tags = getWeatherTags(weather, temp);
      console.log("🎯 추출된 태그:", tags);

      const params = new URLSearchParams();
      tags.styles.forEach((s) => params.append("style", s));
      tags.tpo.forEach((t) => params.append("tpo", t));

      const outfitRes = await fetch(`https://looksy.p-e.kr/api/outfits?${params.toString()}&size=4`);
      if (!outfitRes.ok) {
        console.log("❌ outfit 불러오기 실패");
        return;
      }

      const data = await outfitRes.json();
      console.log("🟢 받아온 outfit:", data);

      setWeatherOutfits(data);
    });
  } catch (err) {
    console.error("❌ 날씨 기반 코디 실패:", err);
  }
};



//-------------------------------------------------------------------------------------------------------------------
 
  useEffect(() => {
    fetchWeatherAndOutfits(); // ✅ 날씨 기반 코디 추가
    fetchOutfits();
    fetchRecommendedOutfits();
  }, []);
  //




  const currentOutfits = outfits.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // 다음 페이지 이동
  const handleNext = () => {
    if ((page + 1) * itemsPerPage >= outfits.length) {
      // 마지막 페이지면 다시 처음으로
      setPage(0);
    } else {
      setPage((prev) => prev + 1);
    }
  };

  // 이전 페이지 이동
  const handlePrev = () => {
    if (page === 0) {
      // 첫 페이지면 마지막으로
      setPage(Math.floor((outfits.length - 1) / itemsPerPage));
    } else {
      setPage((prev) => prev - 1);
    }
  };
    useEffect(() => {
    const totalPages = Math.ceil(outfits.length / itemsPerPage);

    const interval = setInterval(() => {
      setPage((prevPage) => (prevPage + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [outfits.length]);

 const slideVariants = {
  enter: { x: 100, opacity: 0 },   // ← 기존 300 → 100으로 줄임
  center: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};


  return (
    <section className={'w-full max-w-[1321px] mx-auto py-12 ${className || ""}'}>
      <div className="flex justify-between items-start mb-8">
        <div className="font-extrabold text-5xl tracking-[2.00px] leading-10 ">
          NEW
          <br />
          THIS MONTH
        </div>
        <div className="font-extrabold text-[#000d8a] text-xl tracking-[2.00px] leading-10 whitespace-nowrap">
          
        </div>
      </div>

      {/* Product Grid (슬라이드 적용) */}
<AnimatePresence mode="wait">
  <motion.div
    key={page}
    variants={slideVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="grid grid-cols-4 gap-6 mb-8"
  >
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
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[34px] h-[34px] bg-[#dbdbdb70] opacity-[0.66] rounded-none"
            >
              {/* 비워둔 버튼 */}
            </Button>
          </div>

          <div className="p-3 space-y-2">
            {/* TYPE */}
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

            {/* 하트 버튼 */}
            <button
              onClick={() => toggleLike(outfit.id)}
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:scale-110 transition-all"
            >
              {outfit.liked ? (
                <Heart className="text-red-500 fill-red-500 w-5 h-5" />
              ) : (
                <HeartOff className="text-gray-400 w-5 h-5" />
              )}
            </button>

            {/* 설명 + 좋아요 */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-2">
              <span className="text-sm text-gray-700 font-light truncate max-w-[75%]">
                {outfit.description}
              </span>
              <span className="text-xs text-gray-500">❤️ {outfit.likes}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </motion.div>
</AnimatePresence>


      {/* Navigation Controls */}
<div className="flex justify-center gap-3 mb-12">
  <Button
    variant="outline"
    size="icon"
    onClick={handlePrev}
    className="w-10 h-10 border border-solid border-[#a2a2a2] rounded-none active:scale-90 transition-transform duration-200"
  >
    <ChevronLeft className="w-4 h-4" />
  </Button>
  <Button
    variant="outline"
    size="icon"
    onClick={handleNext}
    className="w-10 h-10 border border-solid border-[#a2a2a2] rounded-none active:scale-90 transition-transform duration-200"
  >
    <ChevronRight className="w-4 h-4" />
  </Button>
</div>


{/* IV COLLECTIONS Section */}
<div className="mb-8">
  <div className="font-extrabold text-5xl tracking-[2.00px] leading-10">
    IV
    <br />
    COLLECTIONS
  </div>
  <div className="font-extrabold text-[#000d8a] text-xl tracking-[2.00px] leading-10 whitespace-nowrap">
    24-25
  </div>

  <div className="grid grid-cols-4 gap-6 mt-6">
    {recommended.slice(0, 12).map((outfit) => (
      <Card
        key={outfit.id}
        className="border border-solid border-[#d6d6d6] rounded-none"
      >
        <CardContent className="p-0 relative">
          <div className="relative">
            <img
              src={outfit.imageUrl}
              className="w-full h-[300px] object-cover"
            />
          </div>
          <div className="p-3">
            <div>
                {[outfit.style, outfit.situation, outfit.season]
                  .filter(Boolean)
                  .map((tag, idx, arr) => (
                    <span key={tag} className="text-blue-500 text-sm">
                      #{tag}
                      {idx < arr.length - 1 && ' '}
                    </span>
                  ))}
              </div>
            
            <div className="font-medium text-[#000000a8] text-xs mt-3">
              {outfit.title}
            </div>
            <div className="border-t border-gray-200 my-2 " />
            <div className="font-medium text-black text-sm ">
              <div className = " mt-1 truncate text-ellipsis overflow-hidden whitespace-nowrap">
              {outfit.description}
              </div>
              <div className="font-medium text-[#000000a8] text-xs truncate">
                {outfit.type}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</div>



      {/* This section would contain additional product cards similar to the above,
          but since they're not fully visible in the image, I've omitted them */}
    </section>
  );
}
