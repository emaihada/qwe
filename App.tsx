import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Character } from './types';
import { generateCharacterProfile, generateCharacterImage } from './services/geminiService';
import { HeroInput } from './components/HeroInput';
import { CharacterCard } from './components/CharacterCard';
import { CharacterDetail } from './components/CharacterDetail';
import { Layers, Github, AlertCircle } from 'lucide-react';

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Generate text profile first
      const profile = await generateCharacterProfile(prompt);
      
      // Create a temporary ID
      const tempId = uuidv4();
      
      // 2. Generate image based on the AI's visual description
      // We can display the text part first while image loads, but for simplicity/cohesion, let's wait.
      // Or better UX: Show character without image, then update with image.
      
      const newCharacter: Character = {
        ...profile,
        id: tempId,
        createdAt: Date.now(),
      };
      
      // Add to list immediately (without image) so user sees progress
      setCharacters(prev => [newCharacter, ...prev]);

      // 3. Generate Image
      try {
        const imageUrl = await generateCharacterImage(profile.visualPrompt);
        // Update character with image
        setCharacters(prev => prev.map(c => 
          c.id === tempId ? { ...c, imageUrl } : c
        ));
      } catch (imgError) {
        console.error("Image generation failed", imgError);
        // We still keep the character, just no image.
        // Maybe show a toast notification here in a real app.
      }

    } catch (err: any) {
      setError(err.message || "캐릭터 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-emerald-50">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-40 bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-white">PersonaAI</span>
          </div>
          <div className="flex items-center gap-4">
             {/* API Key Status Indicator (Implicitly valid if app runs, but nice to have visual) */}
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-medium text-primary">System Online</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        
        {/* Hero & Input */}
        <section className="bg-gradient-to-b from-dark via-emerald-950 to-dark border-b border-white/5">
          <HeroInput onGenerate={handleGenerate} isLoading={isLoading} />
        </section>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Gallery */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
               <span className="w-1 h-8 bg-primary rounded-full"></span>
               최근 생성된 캐릭터
             </h2>
             <span className="text-emerald-400/60 text-sm">{characters.length} characters</span>
          </div>

          {characters.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <div className="mx-auto w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4">
                <Layers className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-emerald-200/60 text-lg">아직 생성된 캐릭터가 없습니다.</p>
              <p className="text-emerald-400/40 text-sm mt-2">위 입력창에 아이디어를 입력하여 첫 번째 캐릭터를 만들어보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {characters.map((char) => (
                <CharacterCard 
                  key={char.id} 
                  character={char} 
                  onClick={setSelectedCharacter} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center text-emerald-600 text-sm">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
          <p>© 2024 PersonaAI. Powered by Google Gemini.</p>
        </div>
      </footer>

      {/* Modal */}
      {selectedCharacter && (
        <CharacterDetail 
          character={selectedCharacter} 
          onClose={() => setSelectedCharacter(null)} 
        />
      )}
    </div>
  );
}