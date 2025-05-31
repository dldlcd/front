import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditOutfit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    style: "",
    color: "",
    season: "",
    situation: "",
    gender: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`https://looksy.p-e.kr/api/outfits/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title,
          description: data.description,
          style: data.style,
          color: data.color,
          season: data.season,
          situation: data.situation,
          gender: data.gender,
        });
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return alert("로그인이 필요합니다");

  const formData = new FormData();

  if (imageFile) formData.append("image", imageFile);

  // ✅ 빈 문자열은 보내지 않도록 조건 추가
  Object.entries(form).forEach(([key, val]) => {
    if (val !== "") {
      formData.append(key, val);
    }
  });

  // 선택적으로 보내고 싶으면 이것도 조건 추가 가능
  formData.append("uploadTime", new Date().toISOString().slice(0, 19));

  const res = await fetch(`https://looksy.p-e.kr/api/auth/mypage/outfits/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (res.ok) {
    alert("수정 완료");
    navigate(`/outfits/${id}`);
  } else {
    alert("수정 실패");
  }
};


  return (
    <div className="max-w-md mx-auto my-10 bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 tracking-tight">코디 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="text-gray-600 text-sm block mb-2">사진 (선택)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">제목</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black py-2 px-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">설명</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black py-2 px-1"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">성별</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
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
            name="season"
            value={form.season}
            onChange={handleChange}
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
            name="situation"
            value={form.situation}
            onChange={handleChange}
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

        <div>
          <label className="text-gray-600 text-sm mb-2 block">스타일</label>
          <select
            name="style"
            value={form.style}
            onChange={handleChange}
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
            name="color"
            value={form.color}
            onChange={handleChange}
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

        <div className="text-center mt-6">
          <button type="submit" className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition">
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
}
