"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPoll } from "./actions";

export default function NewPollPage() {
  const router = useRouter();
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    if (options.length < 10) setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const validOptions = options.filter(opt => opt.trim() !== "");
    
    if (validOptions.length < 2) {
      alert("적어도 2개 이상의 선택지를 입력해주세요.");
      setLoading(false);
      return;
    }

    // Server action 호출
    const id = await createPoll(formData, validOptions);
    if (id) {
      router.push(`/polls/${id}`);
    } else {
      alert("투표 생성에 실패했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-100">
      <h2 className="text-2xl font-bold mb-6">새 투표 만들기</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">질문</label>
          <input 
            type="text" 
            name="question" 
            required 
            placeholder="투표 제목을 입력하세요"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            마감 시간 (선택)
          </label>
          <input 
            type="datetime-local" 
            name="closes_at" 
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">입력하지 않으면 무기한 진행됩니다.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">선택지</label>
          <div className="space-y-3">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  type="text" 
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`선택지 ${i + 1}`}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {options.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => removeOption(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 10 && (
            <button 
              type="button" 
              onClick={addOption}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              + 선택지 추가
            </button>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "생성 중..." : "투표 만들기"}
        </button>
      </form>
    </div>
  );
}
