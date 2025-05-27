import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AddOutfit() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState("");
  const [gender, setGender] = useState("");
  const [situation, setSituation] = useState("");
  const [style, setStyle] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("color", color);
    formData.append("season", season);
    formData.append("situation", situation);
    formData.append("style", style);

    const now = new Date().toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
formData.append("upload_time", now);


    // 📡 백엔드에 전송
    fetch("https://54.180.117.72/api/auth/mypage/uploads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("업로드 실패");
        alert("코디가 등록되었습니다!");
        navigate(-1);
      })
      .catch((err) => {
        console.error("업로드 중 오류:", err);
        alert("업로드 실패");
      });
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white rounded-2xl shadow-md p-6">
  <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 tracking-tight">코디 추가</h2>
  <form onSubmit={handleSubmit} className="space-y-5">

    {/* 이미지 업로드 */}
    <div>
      <label className="text-gray-600 text-sm block mb-2">사진 업로드</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
      />
    </div>

    {/* 제목 */}
    <div>
      <label className="text-gray-600 text-sm mb-2 block">제목</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black py-2 px-1"
        required
      />
    </div>

    <div>
          <label className="block font-medium mb-1">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black py-2 px-1"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">성별</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black py-2 px-1 bg-transparent"
            required
          >
            <option value="">선택</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
            
          </select>
        </div>

    <div>
          <label className="block font-medium mb-1">계절</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black py-2 px-1 bg-transparent"
            required
          >
            <option value="">선택</option>
            <option value="spring">봄</option>
            <option value="summer">여름</option>
            <option value="fall">가을</option>
            <option value="winter">겨울</option>
          </select>
        </div>

    <div>
          <label className="block font-medium mb-1">상황</label>
          <select
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black py-2 px-1 bg-transparent"
            required
          >
            <option value="">선택</option>
            <option value="workout">운동</option>
            <option value="campus">캠퍼스</option>
            <option value="work">출근</option>
            <option value="travel">여행</option>
            <option value="date">데이트</option>
            <option value="outing">가벼운외출</option>
            <option value="daily">데일리</option>

           
          </select>
        </div>

    {/* 스타일 선택 */}
    <div>
      <label className="text-gray-600 text-sm mb-2 block">스타일</label>
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black py-2 px-1 bg-transparent"
      >
        <option value="">선택</option>
        <option value="casual">캐주얼</option>
        <option value="sporty">스포티</option>
        <option value="formal">포멀</option>
        <option value="minimal">미니멀</option>
        <option value="office">오피스</option>
        <option value="street">스트릿</option>
        <option value="date">데이트</option>
        <option value="amercaji">아메카지</option>
        <option value="unique">유니크</option>
        <option value="vintage">빈티지</option>
        <option value="lovely">러블리</option>
        <option value="cityboy">시티보이</option>
        <option value="retro">레트로</option>
      </select>
    </div>

    <div>
      <label className="block font-medium mb-1">색상</label>
      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black py-2 px-1 bg-transparent"
        required
      >
        <option value="">선택</option>
        <option value="black">블랙</option>
        <option value="white">화이트</option>
        <option value="gray">그레이</option>
        <option value="red">레드</option>
        <option value="orange">오렌지</option>
        <option value="yellow">옐로우</option>
        <option value="green">그린</option>
        <option value="blue">블루</option>
        <option value="navy">네이비</option>
        <option value="purple">퍼플</option>
        <option value="pink">핑크</option>
        <option value="brown">브라운</option>
        <option value="beige">베이지</option>
      </select>
    </div>

    {/* 버튼 */}
    <div className="text-center mt-6">
      <Button type="submit" className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition">
        등록하기
      </Button>
    </div>
  </form>
</div>

  );
}
