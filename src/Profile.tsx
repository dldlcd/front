import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

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
  isMe?: boolean;
  
}

const MyProfile: React.FC<ProfileProps> = ({ profile, isMe }) => {
  const navigate = useNavigate();

  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    fetch("http://54.180.117.72/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMyId(data.id.toString()));
  }, []);

  const handleImageChange = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://54.180.117.72/api/auth/profile/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("프로필 이미지 업로드 실패");

      window.location.reload(); // 업로드 후 새로고침 또는 상태 재요청
    } catch (err) {
      console.error("❌ 이미지 업로드 중 오류:", err);
    }
  };
  

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {/* 프로필 상단 */}
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

        <div className="flex items-center gap-4">
          <div className="h-4"></div>

          <div className="pl-0 pr-0 pt-24 pb-2">
            <div className="flex items-center gap-6">
              <div className="relative">
              <img
                  src={profile.profileImage || "/default_image.png"}
                  alt="profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                />

                
                {String(profile.id) === myId && (
                <button 
                  className="absolute -bottom-1 right-1 bg-black text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors text-sm"
                  onClick={() => {
                    // 프로필 이미지 변경 로직
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = 'image/*';
                    fileInput.onchange = (e) => handleImageChange(e);
                    fileInput.click();
                  }}
                >
                  <span className="text-base">+</span>
                </button>
                )}
                
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold ">{profile.nickname}</h2>
                  <p className="text-gray-600">
                    {profile.ageGroup} • {profile.bodyType}
                  </p>
                </div>
                
                </div>
                
              </div>
            </div>
          {String(profile.id) === myId && (
          <div className="flex justify-end ml-80">
                <button
                  onClick={() => {
                    const path = `/profile-setup?userId=${profile.id}`;
                    navigate(path);
                  }}
                  className="ml-5 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                </button>
          </div>
          )}
        </div>
                
                

        {/* 하단 정보 */}
        <div className="w-full text-sm text-gray-700 space-y-0 mb-1 pl-5">
          <p>💪 {profile.bodyType}</p>
          <p>
            👕 {profile.preferredStyles ? profile.preferredStyles.join(", ") : ""}
          </p>
          <p>💬 {profile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
