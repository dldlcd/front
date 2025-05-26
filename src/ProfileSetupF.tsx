import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProfileSetupF() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [bio, setBio] = useState("");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const stepMessages = [
      "안녕하세요! 새로운 친구분이세요?\n닉네임을 알려주시겠어요?",
    
      "선호하는 스타일을 알려주세요!\n예시: 캐주얼, 스트릿, 빈티지",
      "성별을 선택해주세요!",
      "연령대를 알려주세요!",
      "체형을 선택해주세요!",
      "자기소개를 해보세요!",
    ];
  
    const newMessage = stepMessages[step];
  
    // ✅ 같은 메시지가 이미 존재하면 추가하지 않음
    if (!messages.some((m) => m.isBot && m.text === newMessage)) {
      addBotMessage(newMessage);
    }
  }, [step]);

  const addBotMessage = (message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.text === message && m.isBot)) return prev;
      return [...prev, { text: message, isBot: true }];
    });
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { text, isBot: false }]);
  };

  const handleNext = () => {
    // 필수값 체크 + 사용자 메시지 기록
    switch (step) {
      case 0:
        if (!nickname.trim()) return addBotMessage("닉네임을 입력해주세요!");
        addUserMessage(nickname);
        break;
      case 1:
        if (!stylePreference.trim()) return addBotMessage("스타일을 입력해주세요!");
        addUserMessage(stylePreference);
        break;
      case 2:
        if (!gender.trim()) return addBotMessage("성별을 선택해주세요!");
        addUserMessage(gender);
        break;
      case 3:
        if (!ageGroup.trim()) return addBotMessage("연령대를 선택해주세요!");
        addUserMessage(ageGroup);
        break;
      case 4:
        if (!bodyType.trim()) return addBotMessage("체형을 선택해주세요!");
        addUserMessage(bodyType);
        break;
      default:
        break;
    }

    if (step === 6) {
      addUserMessage(bio || "소개 없음");
      handleSubmit();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://54.180.117.72/api/auth/profileSetF/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname,
          preferredStyles: stylePreference.split(",").map((s) => s.trim()),
          gender,
          ageGroup,
          bodyType,
          bio,
        }),
      });

      if (!res.ok) {
        addBotMessage("프로필 저장에 실패했어요. 다시 시도해주세요!");
        return;
      }

      addBotMessage("프로필 저장 완료! 🥳 메인 페이지로 이동할게요!");
      setTimeout(() => navigate("/collections"), 1500);
    } catch (err) {
      addBotMessage("서버 오류가 발생했어요. 나중에 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-8 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl space-y-8 relative overflow-hidden">
        <div className="space-y-4 h-[600px] overflow-y-auto px-2 ">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className={`p-4 rounded-xl whitespace-pre-line ${
                m.isBot 
                  ? "bg-gradient-to-r from-purple-50 to-purple-100" 
                  : "bg-gradient-to-r from-blue-50 to-blue-100 text-right"
              }`}
            >
              <div className="flex items-center gap-2">
                {m.isBot ? (
                  <span className="text-purple-500">🤖</span>
                ) : (
                  <span className="text-blue-500">👤</span>
                )}
                <span className="text-sm">{m.text}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 입력 폼 */}
        {step === 0 && (
          <div className="relative">
            <Input 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              placeholder="닉네임 입력"
              className="w-full  border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-gray-400">{nickname.length}/20</span>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="relative">
            <Input 
              value={stylePreference} 
              onChange={(e) => setStylePreference(e.target.value)} 
              placeholder="ex. 캐주얼, 스트릿"
              className="w-full border border-gray-300 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-gray-400">콤마로 구분</span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500">성별 선택</span>
            <Button
              onClick={() => setGender("male")}
              className={`px-6 py-3 rounded-full text-base ${
                gender === "male" 
                  ? "bg-purple-500 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              남
            </Button>
            <Button
              onClick={() => setGender("female")}
              className={`px-6 py-3 rounded-full text-base ${
                gender === "female" 
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              여
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500">연령대 선택</span>
            {["10s", "20s", "30s", "40s", "50s"].map((age, index) => (
              <Button
                key={index}
                onClick={() => setAgeGroup(age)}
                className={`px-6 py-3 rounded-full text-base ${
                  ageGroup === age 
                    ? "bg-purple-500 text-white"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {age.replace(/s$/, "대")}
              </Button>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500">체형 선택</span>
            {["slim", "average", "muscular", "athletic"].map((type, index) => (
              <Button
                key={index}
                onClick={() => setBodyType(type)}
                className={`px-6 py-3 rounded-full text-base ${
                  bodyType === type 
                    ? "bg-purple-500 text-white"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {type === "slim" ? "슬림" : 
                 type === "average" ? "보통" : 
                 type === "muscular" ? "근육형" : 
                 type === "round" ? "둥근형" : type}
              </Button>
            ))}
          </div>
        )}
        {step === 5 && (
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력해주세요"
              className="w-full h-32 px-6 py-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
            <div className="absolute right-3 bottom-3">
              <span className="text-gray-400">{bio.length}/100</span>
            </div>
          </div>
        )}

        {/* 다음 버튼 */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              className={`px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                step === 5 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              {step === 5 ? "완료하기 →" : "다음으로 →"}
            </Button>
          </div>

          {step === 5 && (
            <div className="text-center text-base text-gray-500">
              <p>프로필을 설정하면</p>
              <p>스타일링 추천 서비스를 이용할 수 있어요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
