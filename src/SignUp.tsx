import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, RotateCcw, Camera, User, Search, ShoppingBag, LogIn, LogOut, Home as HomeIcon, Heart, MessageCircle, Bookmark, PlusSquare, Compass } from "lucide-react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [inch, setInch] = useState("");
  const [pound, setPound] = useState("");

  const [mainImage, setMainImage] = useState("/image-59.png");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [myId, setMyId] = useState<number | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const fetchUserId = async () => {
      try {
        const res = await fetch("https://54.180.117.72/api/auth/me", {
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


  const handleSubmit = async () => {
    try {
      const response = await fetch("https://54.180.117.72/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name: `${lastName} ${firstName}`, // 이름 조합
        }),
      });
  
      if (!response.ok) {
        alert("회원가입 실패");
        return;
      }
      
      const userData = await response.json();
      console.log("회원가입 응답값 🔍", userData);

      if (!userData.id) {
        alert("userId가 없습니다! 응답 확인 필요");
        return;
      }

      console.log("✅ 회원가입 응답 데이터:", userData);

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      const path = `/profile-setup-f?userId=${userData.id}`;

      navigate(path);

    } catch (error) {
      alert("서버 오류로 회원가입 실패!");
    }
  };

  const handleHomeClick = () => {
    navigate("/");
    // 페이지가 전환된 후 스크롤을 맨 위로 이동
    setTimeout(scrollToTop, 0);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black font-sans relative overflow-hidden">
      {/* 🔹 좌우 배경 장식 */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#f5f5f5] via-transparent to-transparent opacity-30 z-0" />
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#f5f5f5] via-transparent to-transparent opacity-30 z-0" />

      {/* 🔹 상단 네비게이션 */}
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

      {/* 🔹 본문 */}
      <main className="relative z-10 flex justify-center px-6 py-14 mt-20">
        <div className="w-full max-w-[1300px] bg-white shadow-2xl rounded-2xl p-10 flex flex-col md:flex-row gap-12">
          {/* 왼쪽: 회원가입 폼 */}
          <div className="w-full max-w-lg">
            <h1 className="text-3xl font-bold mb-2">CHECKOUT</h1>
            <div className="flex gap-6 text-sm mb-6">
              <span className="font-semibold">INFORMATION</span>
              <span className="text-gray-400">SHIPPING</span>
              <span className="text-gray-400">PAYMENT</span>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold">CONTACT INFO</p>
              <Input placeholder="ID (Email)" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <p className="text-sm font-semibold pt-6">SHIPPING ADDRESS</p>
              <div className="flex gap-4">
                <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
              <Input placeholder="State/Region" value={state} onChange={(e) => setState(e.target.value)} />
              <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <div className="flex gap-4">
                <Input placeholder="Inch" value={inch} onChange={(e) => setInch(e.target.value)} />
                <Input placeholder="Pound" value={pound} onChange={(e) => setPound(e.target.value)} />
              </div>

              <Button onClick={handleSubmit} className="w-full bg-black text-white hover:bg-gray-800 mt-4">
                Sign up →
              </Button>
            </div>
          </div>

          {/* 오른쪽: 메인 이미지 + 썸네일 */}
          <div className="hidden md:flex w-full max-w-[650px] gap-6">
            <div className="flex-1">
              <img
                src={mainImage}
                alt="Main visual"
                className="w-full h-full max-h-[620px] object-cover rounded-xl shadow-md"
              />
            </div>

            <div className="flex flex-col gap-4">
              {["thumb-1.png", "thumb-2.png", "thumb-3.png", "thumb-4.png", "thumb-5.png"].map((src, i) => (
                <img
                  key={i}
                  src={`/${src}`}
                  alt={`thumb-${i + 1}`}
                  onClick={() => setMainImage(`/${src}`)}
                  className={`w-[100px] h-[100px] object-cover rounded shadow-md cursor-pointer hover:opacity-80 transition ${
                    mainImage === `/${src}` ? "ring-2 ring-black" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
