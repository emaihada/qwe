import React from 'react';
import { Character } from '../types';
import { X, Shield, Zap, Brain, Target, User } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface CharacterDetailProps {
  character: Character;
  onClose: () => void;
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({ character, onClose }) => {
  // Prevent scrolling on body when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-card border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 lg:w-2/5 shrink-0 bg-emerald-950 sticky top-0">
           {character.imageUrl && (
            <img 
              src={character.imageUrl} 
              alt={character.name} 
              className="w-full h-full object-cover min-h-[300px] md:min-h-full max-h-[80vh] md:max-h-none"
            />
          )}
           <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:hidden" />
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 p-6 md:p-10 text-emerald-50 overflow-y-auto">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-bold tracking-wide mb-3 border border-secondary/20">
              {character.title}
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">{character.name}</h2>
            <div className="flex flex-wrap gap-2 mb-6">
               {character.traits.map((trait, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-emerald-950/50 text-sm text-emerald-200 border border-emerald-800/50">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Backstory */}
            <section>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                배경 이야기
              </h3>
              <p className="text-emerald-100/80 leading-relaxed whitespace-pre-line text-justify">
                {character.fullBackstory}
              </p>
            </section>

            {/* Stats Chart */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                능력치 분석
              </h3>
              <div className="h-[300px] w-full bg-emerald-950/30 rounded-xl p-4 border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={character.stats}>
                    <PolarGrid stroke="#065f46" />
                    <PolarAngleAxis dataKey="label" tick={{ fill: '#6ee7b7', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Stats"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="#10b981"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>
            
            {/* Visual Description (Hidden gem for nerds) */}
            <section className="bg-black/30 p-4 rounded-lg border border-white/5">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Generated Visual Prompt</h4>
              <p className="text-xs text-emerald-600 font-mono italic">
                "{character.visualPrompt}"
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};