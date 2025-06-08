import { useEffect, useState } from "react";
import {
  Search, ShoppingBag, User, LogIn, LogOut,
  Home as HomeIcon, Heart, MessageCircle, Bookmark,
  PlusSquare, Compass
} from "lucide-react";
import CollectionSection from "./CollectionSection";
import WeatherSection from "./WeatherSection";
import DesignApproachSection from "./DesignApproachSection";
import FooterSection from "./FooterSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import "./index.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { parseSearchKeyword } from "@/utils/parseSearchKeyword";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState(""); // ✅ 검색어 상태
  const [myId, setMyId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ 유저 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUserId = async () => {
      try {
        const res = await fetch("https://looksy.p-e.kr/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMyId(data.id);
      } catch (err) {
        console.error("사용자 ID 조회 실패:", err);
      }
    };

    fetchUserId();
  }, []);

  // ✅ 로그인 상태 체크
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");

    if (tokenFromURL) {
      localStorage.setItem("token", tokenFromURL);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, "/");
    } else {
      const tokenFromStorage = localStorage.getItem("token");
      setIsLoggedIn(!!tokenFromStorage);
    }
  }, [location]);

  // ✅ 검색 핸들러
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
  
    const filters = parseSearchKeyword(searchQuery);
    const params = new URLSearchParams();
  
    filters.style?.forEach((s) => params.append("style", s));
    if (filters.gender) params.set("gender", filters.gender);
    filters.season?.forEach((s) => params.append("season", s));
    if (filters.tpo) params.set("tpo", filters.tpo);
  
    // ✅ 검색 로그 저장
    await fetch("https://looksy.p-e.kr/api/searchlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
      },
      body: JSON.stringify({
        query: searchQuery,
        filters: params.toString(),
      }),
    });
  
    navigate(`/collections?${params.toString()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다!");
    navigate("/signin");
  };

  const handleHomeClick = () => {
    navigate("/");
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const goUserPage = () => {
    if (myId) {
      navigate(`/user/${myId}`);
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const goSignIn = () => navigate("/signin");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-3 flex justify-between items-center h-14">
          {/* 검색 바 */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-md px-3 py-1.5 w-64">
            <Search
              className="h-4 w-4 text-gray-400 mr-2 cursor-pointer"
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>

          {/* 로고 */}
          <div className="text-xl font-semibold">
            <img src="/logo3.png" alt="logo" className="h-8 w-25 ml-20" />
          </div>

          {/* 네비게이션 아이콘 */}
          <div className="flex items-center space-x-6">
            <Button variant="ghost" className="flex-col h-auto p-2 min-w-[60px]" onClick={handleHomeClick}>
              <HomeIcon className="h-5 w-5" />
              <span className="text-xs mt-1">홈</span>
            </Button>

            {isLoggedIn && (
              <Button variant="ghost" className="flex-col h-auto p-2 min-w-[60px]" onClick={goUserPage}>
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">마이페이지</span>
              </Button>
            )}

            <Button variant="ghost" className="flex-col h-auto p-2 min-w-[60px]" onClick={() => navigate("/collections")}>
              <Compass className="h-5 w-5" />
              <span className="text-xs mt-1">탐색</span>
            </Button>

            {!isLoggedIn && (
              <Button variant="ghost" className="flex-col h-auto p-2 min-w-[60px]" onClick={() => navigate("/signup")}>
                <Compass className="h-5 w-5" />
                <span className="text-xs mt-1">회원가입</span>
              </Button>
            )}

            {isLoggedIn ? (
              <Button variant="ghost" className="flex-col h-auto p-2 min-w-[60px]" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="text-xs mt-1">로그아웃</span>
              </Button>
            ) : (
              <Button variant="ghost" className="flex-col h-auto p-2 min-w-[60px]" onClick={goSignIn}>
                <LogIn className="h-5 w-5" />
                <span className="text-xs mt-1">로그인</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-0">
          <section className="mb-8">
            <DesignApproachSection />
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-4">My COLLECTION</h2>
            <CollectionSection />
          </section>

        </div>
      </main>
    </div>
  );
}
