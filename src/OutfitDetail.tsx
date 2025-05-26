import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {  Heart, HeartOff } from "lucide-react";
import MyProfile from "./Profile";

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

interface ProfileProps {
  profile: {
    id: number;
    nickname: string;
    gender: string;
    ageGroup: string;
    bodyType: string;
    preferredStyles: string[];
    profileImage: string;
    bio: string;
  };
  
}

export default function OutfitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  

  // 컴포넌트가 마운트될 때 좋아요 상태를 가져오는 함수
  
  const fetchOutfit = async (id: string, setOutfit: React.Dispatch<React.SetStateAction<Outfit | null>>) => {
    const token = localStorage.getItem("token");
    const url = token
      ? `https://54.180.117.72/api/outfits/auth/${id}`
      : `https://54.180.117.72/api/outfits/${id}`;
  
    try {
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setOutfit(data);
    } catch (error) {
      console.error("Error fetching outfit:", error);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    fetch("https://54.180.117.72/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMyId(data.id.toString()));
  }, []);


  const toggleLike = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다");
      return;
    }
  
    try {
      const res = await fetch(`https://54.180.117.72/api/auth/like/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("좋아요 토글 실패");
  
      await res.json();
  
      // 🔥 이 부분 수정!
      if (id) {
        await fetchOutfit(String(id), setOutfit); // <- 명시적으로 전달!
      }
    } catch (error) {
      console.error("좋아요 토글 에러:", error);
    }
  };

  const toggleBookmark = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다");
      return;
    }
  
    try {
      const res = await fetch(`https://54.180.117.72/api/auth/bookmark/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("북마크 토글 실패");
  
      await res.json();
      await fetchOutfit(String(id), setOutfit); // ✅ 상태 갱신
    } catch (error) {
      console.error("북마크 토글 에러:", error);
    }
  };

  

  // 초기 데이터 로딩 및 좋아요 상태 갱신
  useEffect(() => {
    if (!id) return;
    fetchOutfit(id, setOutfit);
    
  }, [id]);
  

  if (!outfit) return <div className="text-center mt-10">불러오는 중...</div>;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col border border-gray-200 max-w-[650px] mx-auto">
      {/* 상단 바 */}
      <div className="fixed top-0 left-0 right-0 max-w-[650px] mx-auto bg-white border-b z-50 shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)} 
                className="text-xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                ←
              </button>
              
            </div>
          </div>
        </div>

      {/* 게시물 내용 */}
      <div className="w-full max-w-[650px] mx-auto mt-14 mb-16">
      <div className="h-4"></div>
        {/* 작성자 정보 */}
        
        <div
          className="flex items-center gap-3 px-4 pt-[20px] pb-3 cursor-pointer"
          onClick={() => navigate(`/user/${outfit.userId}`)}
        >
          <img
            src={
              outfit.userProfileImage && outfit.userProfileImage.startsWith("/")
                ? outfit.userProfileImage
                : "/default_image.png"
            }
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <span className="text-sm font-semibold">{outfit.userNickname}</span>
      </div>
      

        {/* 이미지 */}
        <div className="w-full aspect-square bg-black overflow-hidden">
          <img
            src={outfit.imageUrl}
            alt="Outfit"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 액션 버튼 */}
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-5">
              <button
                onClick={() => toggleLike(outfit.id)}
                className="p-1.5 hover:bg-red-50 rounded-full transition-colors"
              >
                {outfit.liked ? (
                  <Heart className="text-red-500 fill-red-500 w-5 h-5" />
                ) : (
                  <HeartOff className="text-gray-400 w-5 h-5" />
                )}
              </button>
              <button 
                onClick={() => setIsCommentOpen(true)} 
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6 -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => toggleBookmark(outfit.id)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              {outfit.bookmarked ? (
                <svg
                  className="w-6 h-6 text-blue-500 fill-blue-500 hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-black hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* 좋아요 수 */}
          <div 
            className="font-semibold text-sm mb-2 cursor-pointer"
            onClick={() => toggleLike(outfit.id)}
          >
            좋아요 <span>{Number(outfit.likes).toLocaleString()}</span>
          </div>

          {/* 설명 */}
          <div className="text-sm mb-1">
            <span className="font-semibold">{outfit.userNickname} </span>
            {outfit.description}
          </div>

          {/* 태그 */}
          <div className="flex gap-2 flex-wrap mt-2">
            {["#소프트", "#바다", "#여행", "#데이트"].map((tag) => (
              <span key={tag} className="text-blue-500 text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* 날짜 */}
          <div className="text-xs text-gray-400 mt-2">
            2025년 4월 29일
          </div>
        </div>
      </div>

      {/* 댓글 모달 */}
      <div
        className={`fixed bottom-0 left-0 right-0 max-w-[650px] mx-auto bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${
          isCommentOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "70vh", zIndex: 60 }}
      >
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <span className="font-semibold">댓글</span>
          <button 
            onClick={() => setIsCommentOpen(false)}
            className="text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(70vh-120px)]">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-4xl mb-2">💬</span>
              <p>아직 댓글이 없습니다.</p>
            </div>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="py-3 border-b">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="text-sm font-semibold">사용자{i+1}</p>
                    <p className="text-sm">{c}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t absolute bottom-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 border rounded-full text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                placeholder="댓글 달기..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newComment.trim()) {
                    setComments([...comments, newComment]);
                    setNewComment("");
                  }
                }}
              />
              <button
                onClick={() => {
                  if (!newComment.trim()) return;
                  setComments([...comments, newComment]);
                  setNewComment("");
                }}
                disabled={!newComment.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold px-3 py-1 rounded-full ${
                  newComment.trim() 
                    ? 'text-blue-500 hover:bg-blue-50' 
                    : 'text-blue-300'
                } transition-colors`}
              >
                게시
              </button>
            </div>
          </div>
        </div>

        

        {/* 하단 버튼 바 */}
        <div className="shadow-[0_-4px_12px_rgba(0,0,0,0.20)] fixed bottom-0 left-0 right-0 w-full flex justify-between items-center max-w-[650px] mx-auto bg-white border-t shadow-md px-10 py-5 z-50">
          <Button
          
            onClick={() => navigate(`/user/${myId}`)}
            className="shadow-md bg-black text-white px-6 py-5 rounded-full text-sm hover:bg-gray-800"
          >
            
            마이페이지
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="shadow-md bg-black text-white px-6 py-5 rounded-full text-sm hover:bg-gray-800"
          >
            홈
          </Button>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[650px] mx-auto bg-white border-t border-gray-100 z-40 shadow-[0_-1px_15px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-14">
          {/* 홈 버튼 */}
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          
          {/* 검색 버튼 */}
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          
          
          {/* 북마크 버튼 */}
          <button 
            onClick={() => navigate(`/user/${myId}/bookmark`)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          
          {/* 마이페이지 버튼 */}
          <button 
            onClick={() => navigate(`/user/${myId}`)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <img
              src={outfit.userProfileImage || "/default_image.png"}
              onError={(e) => {
                e.currentTarget.src = "/default_image.png";
              }}
              alt="My Profile"
              className="w-6 h-6 rounded-full object-cover border"
            />
          </button>
        </div>
      </div>
    </div>
  );
};