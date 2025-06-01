import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // ✅ bio 입력용

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [nickname, setNickname] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://looksy.p-e.kr/api/auth/profileSet/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname,
          preferredStyles: stylePreference
            .split(',')
            .map((s) => s.trim()),
          gender,
          ageGroup,
          bodyType,
          bio,
        }),
      });

      if (!res.ok) {
        alert("프로필 설정 실패!");
        return;
      }

      alert("프로필 설정 완료!");
      navigate("/collections");
    } catch (error) {
      console.error("프로필 설정 오류:", error);
      alert("서버 오류!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">프로필 설정</h1>

        <div className="space-y-4">
          <Input placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          <Input placeholder="선호 스타일 (ex. 캐주얼, 스트릿)" value={stylePreference} onChange={(e) => setStylePreference(e.target.value)} />


          <Input placeholder="연령대 (예: 20s, 30s)" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} />
          <Input placeholder="체형 (예: slim, average, muscular)" value={bodyType} onChange={(e) => setBodyType(e.target.value)} />

          <div>
                <label className="block text-sm font-medium text-gray-700">성별</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                >
                    <option value="">성별 선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
            </div>

            <Textarea
                placeholder="자기소개 (예: 스타일 취향, 관심사 등)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[100px]"
              />


          <Button className="w-full bg-black text-white hover:bg-gray-800 mt-4" onClick={handleSubmit}>
            저장하고 시작하기 →
          </Button>
        </div>
      </div>
    </div>
  );
}
