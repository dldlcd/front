import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Search, ShoppingBag, User, LogIn, LogOut,
  Home as HomeIcon, Heart, MessageCircle, Bookmark,
  PlusSquare, Compass, Filter, SlidersHorizontal
} from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import FilterButton from "@/components/filter/FilterButton";
import FilterPanel from "@/components/filter/FilterPanel";
import { parseSearchKeyword } from "@/utils/parseSearchKeyword";


interface Outfit {
  id: number;
  imageUrl: string;
  title: string;
  likes: number;
  items: number;
  userId: number;
  userNickname: string;
  style: string;
}

interface FilterOption {
  id: string;
  label: string;
  type: 'style' | 'season' | 'tpo' | 'gender';
}

const FILTER_OPTIONS = [
  { id: 'casual', label: '캐주얼', type: 'style' },
  { id: 'sporty', label: '스포티', type: 'style' },
  { id: 'formal', label: '포멀', type: 'style' },
  { id: 'minimal', label: '미니멀', type: 'style' },
  { id: 'office', label: '오피스', type: 'style' },
  { id: 'street', label: '스트릿', type: 'style' },
  { id: 'amercaji', label: '아메카지', type: 'style' },
  { id: 'unique', label: '유니크', type: 'style' },
  { id: 'vintage', label: '빈티지', type: 'style' },
  { id: 'lovely', label: '러블리', type: 'style' },
  { id: 'cityboy', label: '시티보이', type: 'style' },
  { id: 'retro', label: '레트로', type: 'style' },

  { id: 'male', label: '남성', type: 'gender' },
  { id: 'female', label: '여성', type: 'gender' },

  { id: 'spring', label: '봄', type: 'season' },
  { id: 'summer', label: '여름', type: 'season' },
  { id: 'fall', label: '가을', type: 'season' },
  { id: 'winter', label: '겨울', type: 'season' },

  { id: 'daily', label: '데일리', type: 'tpo' },
  { id: 'campus', label: '캠퍼스', type: 'tpo' },
  { id: 'date', label: '데이트', type: 'tpo' },
  { id: 'work', label: '출근', type: 'tpo' },
  { id: 'travel', label: '여행', type: 'tpo' },
  { id: 'outing', label: '가벼운 외출', type: 'tpo' },
  { id: 'workout', label: '운동', type: 'tpo' },
] as const;

type FilterOptionRaw = typeof FILTER_OPTIONS[number];

const FILTER_OPTIONS_TYPED: FilterOption[] = FILTER_OPTIONS.map(opt => ({
  id: opt.id,
  label: opt.label,
  type: opt.type as 'style' | 'season' | 'tpo' | 'gender'
}));


function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Collections() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const goCart = () => navigate('/cart');
  const goSignIn = () => navigate('/signin');
  const goUserPage = () => {
    if (myId) {
      navigate(`/user/${myId}`);
    } else {
      alert("로그인이 필요합니다.");
    }
  };
  const [searchQuery, setSearchQuery] = useState(""); // ✅ 검색어 상태


  const [myId, setMyId] = useState<number | null>(null);

  const [showFilter, setShowFilter] = useState(false);

  const selectedStyles = searchParams.getAll("style");
  const selectedSeason = searchParams.getAll("season");
  const selectedTpo = searchParams.getAll("tpo");
  const selectedGender = searchParams.get("gender") || "";

  

  // 선택된 태그 ID 목록
     const selectedItems: { id: string; type: 'style' | 'season' | 'tpo' | 'gender' }[] = [
    ...selectedStyles.map((id) => ({ id, type: 'style' as const })),
    ...selectedSeason.map((id) => ({ id, type: 'season' as const })),
    ...selectedTpo.map((id) => ({ id, type: 'tpo' as const })),
    ...(selectedGender ? [{ id: selectedGender, type: 'gender' as const }] : []),
  ];
    
    const sortedFilterListRef = useRef<FilterOption[]>([]);

  const selectedFilterListTyped: FilterOption[] = selectedItems.flatMap(({ id, type }) => {
  const found = FILTER_OPTIONS_TYPED.find(f => f.id === id && f.type === type);
  return found ? [found] : [];
});

// 이걸 사용
if (sortedFilterListRef.current.length === 0) {
    const selectedKeys = new Set(selectedFilterListTyped.map((f) => `${f.type}:${f.id}`));
    const unselected = FILTER_OPTIONS.filter(
      (f) => !selectedKeys.has(`${f.type}:${f.id}`)
    );
    sortedFilterListRef.current = [...selectedFilterListTyped, ...shuffleArray(unselected)];
  } else {
    const selectedKeys = new Set(selectedFilterListTyped.map((f) => `${f.type}:${f.id}`));
    const alreadySorted = sortedFilterListRef.current;
    const selectedInOrder = selectedFilterListTyped;
    const rest = alreadySorted.filter(
      (f) => !selectedKeys.has(`${f.type}:${f.id}`)
    );
    sortedFilterListRef.current = [...selectedInOrder, ...rest];
  }

  const sortedFilterList = sortedFilterListRef.current;



  const [activeFilters, setActiveFilters] = useState({
  style: [] as string[],
  season: [] as string[],
  tpo: [] as string[],
  gender: "",
  });



  const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  const filters = parseSearchKeyword(searchQuery);
  const params = new URLSearchParams();

  filters.style?.forEach((s) => params.append("style", s));
  filters.season?.forEach((s) => params.append("season", s));
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.tpo) {
    const tpoArray = Array.isArray(filters.tpo) ? filters.tpo : [filters.tpo];
    tpoArray.forEach((s) => params.append("tpo", s));
  }

  if (!params.toString()) {
    alert("적절한 태그를 포함한 검색어를 입력해주세요.");
    return;
  }

  // ✅ 먼저 검색어를 초기화한 후
  setSearchQuery("");

  // ✅ 필터 적용
  setSearchParams(params);

  // ✅ 로그 기록은 나중에
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
};


  
  

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
        setMyId(data.id); // 로그인한 사용자 ID 저장
      } catch (err) {
        console.error("사용자 ID 조회 실패:", err);
      }
    };
  
    fetchUserId();
  }, []);



   // 그리드 클릭 처리
  const handleTagClick = async (id: string, type: string) => {
  const newParams = new URLSearchParams(searchParams.toString());

  if (type === "style") {
    const current = searchParams.getAll("style");
    const updated = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    newParams.delete("style");
    updated.forEach((s) => newParams.append("style", s));
  }

  if (type === "season") {
    const current = searchParams.getAll("season");
    const updated = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    newParams.delete("season");
    updated.forEach((s) => newParams.append("season", s));
  }

  if (type === "tpo") {
    const current = searchParams.getAll("tpo");
    const updated = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    newParams.delete("tpo");
    updated.forEach((s) => newParams.append("tpo", s));
  }

  if (type === "gender") {
    const current = searchParams.get("gender");
    if (current === id) newParams.delete("gender");
    else newParams.set("gender", id);
  }

  setSearchParams(newParams);

  const res = await fetch(`https://looksy.p-e.kr/api/outfits?${newParams.toString()}`);
  const data = await res.json();
  setOutfits(data);
};




  
    useEffect(() => {
      const fetchFilteredOutfits = async () => {
        try {
          const url = searchParams.toString()
            ? `https://looksy.p-e.kr/api/outfits?${searchParams.toString()}`
            : `https://looksy.p-e.kr/api/outfits`; // ✅ 빈 경우 기본 API 호출

          const res = await fetch(url);
          const data = await res.json();
          setOutfits(data);
        } catch (err) {
          console.error('필터 적용 실패:', err);
        }
      };

      fetchFilteredOutfits(); // ✅ 항상 호출되도록 수정
    }, [searchParams]);


  // 기존의 홈 버튼 클릭 핸들러 수정
  const handleHomeClick = () => {
    navigate("/");
    // 페이지가 전환된 후 스크롤을 맨 위로 이동
    setTimeout(scrollToTop, 0);
  };

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

  useEffect(() => {
    fetch('https://looksy.p-e.kr/api/outfits')
      .then((res) => res.json())
      .then(setOutfits)
      .catch((err) => console.error('데이터 로딩 실패:', err));
  }, []);

  

  return (
    <div className="min-h-screen bg-gray-50">
     
     {showFilter && (
    <div className="max-w-7xl mx-auto pt-14 mt-1"> {/* 헤더 높이 만큼 여백 줌 */}
      <FilterPanel
            onApply={(filters) => {
              const newParams = new URLSearchParams();
              filters.style.forEach((v) => newParams.append("style", v));
              if (filters.season) newParams.set("season", filters.season);
              if (filters.gender) newParams.set("gender", filters.gender);
              filters.tpo.forEach((v) => newParams.append("tpo", v));
              setSearchParams(newParams);
              setShowFilter(false);
            }}
            onClose={() => setShowFilter(false)}
            selectedStyles={selectedStyles}
            selectedGender={searchParams.get("gender") || ""}
            selectedSeason={searchParams.get("season") || ""}
            selectedTpo={selectedTpo}
          />
    </div>
  )}
    <header className="bg-white border-b border-gray-200 fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-3 flex justify-between items-center h-14 ">
          {/* 로고 */}
          

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

          <div className="text-xl font-semibold"><img src="/logo3.png" alt="logo" className="h-8 w-25 ml-20" /></div>

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
      {/* 상단 네비게이션 바 */}
      {!showFilter && (
         <>
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">컬렉션</h1>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="rounded-full"
            >
              홈으로
            </Button>
          </div>
        </div>
      </div>

      

      
      
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6 py-4 overflow-x-auto no-scrollbar">

          <Button 
            onClick={() => setShowFilter(true)}
            className="w-16 h-16 rounded-full flex items-center justify-center p-0.5 bg-white border border-gray-300 shadow-sm"
          >
            <SlidersHorizontal className="w-6 h-6 text-gray-600" />
          </Button>
            
            {sortedFilterList.slice(0, 13).map((filter) => {
              const isActive =
                selectedStyles.includes(filter.id) && filter.type === "style" ||
                selectedSeason.includes(filter.id) && filter.type === "season" ||
                selectedTpo.includes(filter.id) && filter.type === "tpo" ||
                searchParams.get("gender") === filter.id && filter.type === "gender";

              return (
                <div key={`${filter.type}:${filter.id}`} className="flex flex-col items-center space-y-1 flex-shrink-0">
                  <button
                    onClick={() => handleTagClick(filter.id, filter.type)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center p-0.5 ${
                      isActive
                        ? 'bg-gradient-to-tr from-yellow-400 to-pink-500'
                        : 'bg-gradient-to-tr from-gray-200 to-gray-300'
                    }`}
                  >
                    <div className="bg-white rounded-full p-0.5 w-full h-full flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-xs">
                        {filter.label.slice(0, 6)}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>



      {/* 스크롤바 숨기기 */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>



      {/* 아웃핏 그리드 */}
      <div className="max-w-7xl mx-auto p-4 ">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[300px]">
    {outfits.length === 0 ? (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-gray-400">
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
        <h2 className="text-lg font-semibold text-gray-500 mb-2">
          게시물이 없습니다
        </h2>
      </div>
    ) : (
      outfits.map((outfit) => (
        <div
          key={outfit.id}
          className="relative group cursor-pointer"
          onClick={() => navigate(`/outfit/${outfit.id}`)}
        >
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={outfit.imageUrl}
              alt={outfit.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg" />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent text-white rounded-b-lg">
            <h3 className="font-semibold text-sm">{outfit.title}</h3>
            <div className="flex items-center text-xs text-gray-200">
              <span>
                ❤️{' '}
                {typeof outfit.likes === 'number'
                  ? outfit.likes.toLocaleString()
                  : 0}
              </span>
              <span className="mx-1">•</span>
              <span>{outfit.items} items</span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</div>

      </>
      )}
    </div>
      
  );
}
