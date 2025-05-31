import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Outfit {
  id: number;
  userId: number;
}

interface OutfitOptionsProps {
  outfit: Outfit;
  myId: number;
  onDelete: () => void; // 삭제 시 부모에게 알려줄 콜백
}

export default function OutfitOptions({ outfit, myId, onDelete }: OutfitOptionsProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`https://looksy.p-e.kr/api/outfits/${outfit.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("삭제 완료");
        onDelete(); // 삭제 후 부모 컴포넌트에 알림
      } else {
        alert("삭제 실패");
      }
    } catch (err) {
      alert("서버 오류");
    }
  };

  return (
    <div className="relative inline-block text-left">
      {outfit.userId === Number(myId) && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="ml-auto text-2xl px-2 py-1 mb-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            ⋯
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 shadow-lg rounded-lg z-20">
              <button
                onClick={() => {
                  navigate(`/edit/${outfit.id}`);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                ✏ 수정하기
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
              >
                🗑 삭제하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
