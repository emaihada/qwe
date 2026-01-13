import React, { useState } from 'react';
import { Sparkles, Loader2, Dice5 } from 'lucide-react';

interface HeroInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const RANDOM_PROMPTS = [
  "미래 도시의 사이버펑크 해커",
  "숲을 지키는 고대 엘프 수호자",
  "우주를 여행하는 현상금 사냥꾼",
  "저주받은 갑옷을 입은 기사",
  "말하는 고양이 마법사",
  "스팀펑크 스타일의 발명가"
];

export const HeroInput: React.FC<HeroInputProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };

  const handleRandom = () => {
    const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(random);
  };

  return (
    <div className="relative py-20 px-4 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-primary/10 blur-[100px] rounded-full -z-10 opacity-50" />
      
      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-400 mb-6 tracking-tight">
        Persona<span className="text-primary">AI</span>
      </h1>
      
      <p className="text-lg md:text-xl text-emerald-200/60 mb-10 max-w-2xl leading-relaxed">
        상상 속의 캐릭터를 현실로 불러오세요.<br/>
        간단한 설명만으로 상세한 설정과 고화질 일러스트를 생성해 드립니다.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center bg-card rounded-xl p-2 border border-white/10 shadow-2xl">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 용감한 사자 기사, 신비로운 숲의 요정..."
            className="flex-1 bg-transparent text-white px-4 py-3 outline-none placeholder:text-emerald-600 text-lg"
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={handleRandom}
            className="p-3 text-emerald-500 hover:text-white transition-colors"
            title="랜덤 예시"
            disabled={isLoading}
          >
            <Dice5 className="w-6 h-6" />
          </button>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden md:inline">생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="hidden md:inline">생성하기</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-emerald-600/80">
        <span>인기 키워드:</span>
        {["다크 판타지", "SF", "동화", "느와르"].map(tag => (
          <span 
            key={tag} 
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={() => setPrompt(tag)}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};