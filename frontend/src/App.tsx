import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Heart, Music, Waves, Sun, Moon } from 'lucide-react';
import { TSITPWrapped } from './components/tsitp-wrapped';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const [showWrapped, setShowWrapped] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1621622807857-ae68f7e707f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBiZWFjaCUyMG9jZWFuJTIwc3Vuc2V0fGVufDF8fHx8MTc1ODQ3NzUwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Summer beach sunset"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/90 via-orange-200/40 to-pink-300/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {!showWrapped ? (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Waves className="w-8 h-8 text-blue-500" />
                  <Heart className="w-6 h-6 text-pink-400" />
                  <Music className="w-8 h-8 text-orange-400" />
                </div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TSITP Wrapped
                </h1>
                <p className="text-xl text-gray-700 max-w-lg mx-auto">
                  Discover which "The Summer I Turned Pretty" character matches your music vibe this summer
                </p>
              </div>

              {/* Features Preview */}
              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card className="bg-white/70 backdrop-blur-sm border-blue-300/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <Sun className="w-5 h-5" />
                      Team Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Find out if you're Team Conrad (moody indie) or Team Jeremiah (sunny pop)
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-pink-300/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-pink-500">
                      <Heart className="w-5 h-5" />
                      Character Match
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      See which character's playlist vibes match your summer listening
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-orange-300/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-500">
                      <Music className="w-5 h-5" />
                      Summer Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Your personal summer soundtrack wrapped with TSITP moments
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-purple-300/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-purple-500">
                      <Waves className="w-5 h-5" />
                      Mood Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Deep dive into your music's energy, vibe, and summer feels
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowWrapped(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 hover:opacity-90 text-white px-8 py-3 text-lg shadow-lg"
                >
                  Get My TSITP Wrapped
                </Button>
                <p className="text-sm text-gray-500">
                  *Demo version with sample data - full version connects to Spotify
                </p>
              </div>
            </div>
          </div>
        ) : (
          <TSITPWrapped onBack={() => setShowWrapped(false)} />
        )}
      </div>
    </div>
  );
}