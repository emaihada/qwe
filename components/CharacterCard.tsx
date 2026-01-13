import React from 'react';
import { Character } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  return (
    <div 
      onClick={() => onClick(character)}
      className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer border border-white/5 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="aspect-square w-full overflow-hidden bg-emerald-950 relative">
        {character.imageUrl ? (
          <img 
            src={character.imageUrl} 
            alt={character.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-emerald-800">
            <Sparkles className="w-12 h-12 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute bottom-0 left-0 p-4 w-full">
           <p className="text-secondary text-xs font-bold tracking-wider uppercase mb-1">{character.title}</p>
           <h3 className="text-2xl font-black text-white leading-tight">{character.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-emerald-100/60 text-sm line-clamp-2">
          {character.shortDescription}
        </p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {character.traits.slice(0, 3).map((trait, idx) => (
            <span key={idx} className="px-2 py-1 rounded-md bg-white/5 text-xs text-emerald-200/80 border border-white/10">
              #{trait}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center text-primary text-sm font-medium group-hover:text-primary/80 transition-colors">
          자세히 보기 <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};