import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Loader2, Music, Waves, Heart } from 'lucide-react';

const loadingMessages = [
  "Analyzing your summer playlist... 🎵",
  "Checking for moody indie vibes... 🌊",
  "Counting sunny pop hits... ☀️",
  "Matching you with TSITP characters... 💕",
  "Calculating Team Conrad vs Team Jeremiah... 🏖️",
  "Almost done... wrapping up your summer... 🎁"
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Waves className="w-8 h-8 text-blue-500 animate-pulse" />
            <Heart className="w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <Music className="w-8 h-8 text-orange-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>

          <div>
            <Loader2 className="w-12 h-12 text-purple-500 mx-auto animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Creating Your TSITP Wrapped
            </h2>
            <p className="text-gray-600 min-h-[1.5rem] transition-opacity">
              {loadingMessages[messageIndex]}
            </p>
          </div>

          <div className="flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
