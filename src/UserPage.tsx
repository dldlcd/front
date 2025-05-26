import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MyProfile from "./Profile";
import { Search, ShoppingBag, User, LogIn, LogOut, Home as HomeIcon, Heart, MessageCircle, Bookmark, PlusSquare, Compass } from "lucide-react";

interface Profile {
  id: number;
  nickname: string;
  gender: string;
  ageGroup: string;
  bodyType: string;
  preferredStyles: string[];
  profileImage: string;
  bio: string;
  
}

interface Outfit {
  id: number;
  imageUrl: string;
  description: string;
  liked: boolean;
  likes: number;
  userId: number;
  userNickname: string;
}

export default function UserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'grid' | 'tagged' | 'bookmark'>('grid');


  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    fetch("https://54.180.117.72:8080/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMyId(data.id.toString()));
  }, []);

  useEffect(() => {
    fetch(`https://54.180.117.72:8080/api/auth/profile/${userId}`)
      .then((res) => res.json())
      .then(setProfile);

    fetch(`https://54.180.117.72:8080/api/auth/User/${userId}`)
      .then((res) => res.json())
      .then(setOutfits);
  }, [userId]);

  if (!profile) return null;

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center pt-0.1 pb-20">
      <div className="w-full max-w-[650px] bg-white px-0">
        {/* 프로필 섹션 */}
        <div className="px-4 pb-4">
        <MyProfile profile={profile} isMe={userId === myId} />


        </div>

        <div className="flex justify-around items-center py-3 border-t border-b">
  {/* 🔲 Grid 탭 */}
        <button
          className="flex flex-col items-center"
          onClick={() => setSelectedTab('grid')}
        >
          <svg className="w-5 h-5 mb-1" fill="black" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
            </svg>
        </button>

        {/* 🔍 Tagged (예시) */}
        <button
          className="flex flex-col items-center"
          onClick={() => setSelectedTab('tagged')}
        >
          <svg className="w-5 h-5 mb-1" fill="gray" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
        </button>

        {/* 🔖 북마크 */}
        <button
        className="flex flex-col items-center"
        onClick={() => {
          setSelectedTab('bookmark');
          navigate(`/user/${userId}/bookmark`);
        }}
      >
      <svg className="w-5 h-5 mb-1" fill="gray" viewBox="0 0 24 24">
              <path d="M5 4v16l7-5 7 5V4H5z" />
            </svg>
      </button>

    </div>

        <div className="w-full max-w-screen-xl py-0.5">
          {outfits.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center pt-45 pb-40 py-20 text-center text-gray-400">
              <svg
                xmlns="https://www.w3.org/2000/svg"
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
                아직 등록된 게시물이 없습니다
              </h2>
              {userId === myId && (
                <p className="text-sm text-gray-400">
                  첫 번째 코디를 등록해보세요 ✨
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-[1px]">
              {outfits.map((outfit) => (
                <div
                  key={outfit.id}
                  onClick={() => navigate(`/outfit/${outfit.id}`)}
                  className="aspect-[3.6/4] overflow-hidden relative bg-black cursor-pointer"
                >
                  <img
                    src={outfit.imageUrl}
                    alt="Outfit"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 바 */}
        <div className="shadow-[0_-4px_12px_rgba(0,0,0,0.20)] fixed bottom-0 left-0 right-0 w-full flex justify-between items-center max-w-[650px] mx-auto bg-white border-t shadow-md px-10 py-5 z-50">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex-col h-auto p-2 min-w-[60px] text-gray-700 hover:text-black"
          >
            <HomeIcon className="h-5 w-5" />
            <span className="text-xs mt-1">홈</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/search")}
            className="flex-col h-auto p-2 min-w-[60px] text-gray-700 hover:text-black"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">검색</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/collections")}
            className="flex-col h-auto p-2 min-w-[60px] text-gray-700 hover:text-black"
          >
            <Compass className="h-5 w-5" />
            <span className="text-xs mt-1">컬렉션</span>
          </Button>

          
        
          {userId === myId && (
          <div className="flex flex-col items-center">
            <PlusSquare
              onClick={() => navigate("/add")}
              className="h-7 w-7 text-gray-700 hover:text-black cursor-pointer"
            />
            <span className="text-xs mt-1">코디추가</span>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
