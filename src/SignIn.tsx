import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Camera, RotateCcw, User, Menu, Search, ShoppingBag, LogIn, LogOut, Home as HomeIcon, Heart, MessageCircle, Bookmark, PlusSquare, Compass } from "lucide-react";

export default function SignIn() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mainImage, setMainImage] = useState("/thumb-1.png");
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [myId, setMyId] = useState<number | null>(null);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const fetchUserId = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMyId(data.id); // 로그인한 사용자 ID 저장
    } catch (err) {
      console.error("사용자 ID 조회 실패:", err);
    }
  };

  fetchUserId();
}, []);

  const goCart = () => navigate('/cart');
  const goUserPage = () => {
    if (myId) {
      navigate(`/user/${myId}`);
    } else {
      alert("로그인이 필요합니다.");
    }
  };
  const goSignIn = () => navigate('/signin');
  const handleReadMore = () => navigate('/collection');
  const token = localStorage.getItem("token");


  useEffect(() => {
    // ✅ 1. URL에서 token 쿼리 파라미터 추출
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");

    // ✅ 2. token 있으면 저장 + 로그인 상태 true
    if (tokenFromURL) {
      localStorage.setItem("token", tokenFromURL);
      setIsLoggedIn(true);
      // ✅ 3. 주소 깔끔하게 정리
      window.history.replaceState({}, document.title, "/");
    } else {
      const tokenFromStorage = localStorage.getItem("token");
      setIsLoggedIn(!!tokenFromStorage);
    }
  }, [location]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다!");
    navigate("/signin");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 부드러운 스크롤 효과
    });
  };

  

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: id, password }),
      });

      if (!response.ok) throw new Error("로그인 실패");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setSuccess("로그인 성공!");
      alert( id + "님 로그인 되었습니다!");
      navigate("/");
    } catch (err) {
      setError("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  const handleHomeClick = () => {
    navigate("/");
    // 페이지가 전환된 후 스크롤을 맨 위로 이동
    setTimeout(scrollToTop, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 바 */}
      <header className="bg-white border-b border-gray-200 fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-3 flex justify-between items-center h-14">
          {/* 로고 */}
          

          {/* 검색 바 */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-md px-3 py-1.5 w-64">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="검색"
              className="bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>

          <div className="text-xl font-semibold"><img src="/logo3.png" alt="logo" className="h-8 w-25 ml-20 " /></div>

          {/* 네비게이션 아이콘들 */}
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
              <>
                <Button variant="ghost" className="flex-col h-auto p-2 min-w-[60px]" onClick={() => navigate("/signup")}>
                  <Compass className="h-5 w-5" />
                  <span className="text-xs mt-1">회원가입</span>
                </Button>

                
              </>
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

      {/* 로그인 섹션 */}
      <div className="flex justify-center items-center flex-1 min-h-[calc(100vh-72px)]">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-10 px-6">
          {/* 이미지 섹션 */}
          <div className="flex gap-6 items-center">
            <img
              src={mainImage}
              alt="Main"
              className="w-[520px] h-[600px] object-cover rounded-md shadow-md"
            />
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`/thumb-${i}.png`}
                  alt={`thumb-${i}`}
                  onClick={() => setMainImage(`/thumb-${i}.png`)}
                  className={`w-[95px] h-[95px] object-cover rounded-md cursor-pointer shadow-sm transition hover:opacity-80 ${
                    mainImage === `/thumb-${i}.png` ? "ring-2 ring-black" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 로그인 폼 */}
          <div className="w-full max-w-lg border border-gray-300 p-10 bg-white shadow-md rounded-md">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-gray-500">Please sign in to continue</p>
            </div>

            <Input
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mb-4 text-base"
              icon={<User />}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 text-base"
              icon={<Lock />}
            />

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

            <Button
              onClick={handleLogin}
              className="w-full bg-black text-white hover:bg-gray-800 mb-4"
            >
              Sign In →
            </Button>

            <Separator className="my-5" />

            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full">
              Continue with Kakao
            </Button>

            <div className="mt-6 text-sm text-center text-gray-500">
              <a href="#" className="underline mr-4">
                비밀번호 찾기
              </a>
              <span
                onClick={() => navigate("/signup")}
                className="underline cursor-pointer"
              >
                회원가입
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
