import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Heart, Music, Waves, Sun, Moon, ArrowLeft, ArrowRight, Share, Download } from 'lucide-react';

// Mock data types
interface Track {
  name: string;
  artist: string;
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  plays: number;
}

interface CharacterPlaylist {
  name: string;
  color: string;
  emoji: string;
  vibe: string;
  tracks: Track[];
  avgEnergy: number;
  avgValence: number;
}

// Mock user data
const mockUserTracks: Track[] = [
  { name: "Cruel Summer", artist: "Taylor Swift", energy: 0.73, valence: 0.56, danceability: 0.55, acousticness: 0.11, plays: 87 },
  { name: "This Love (Taylor's Version)", artist: "Taylor Swift", energy: 0.32, valence: 0.21, danceability: 0.35, acousticness: 0.72, plays: 45 },
  { name: "August", artist: "Taylor Swift", energy: 0.24, valence: 0.23, danceability: 0.41, acousticness: 0.73, plays: 62 },
  { name: "Cardigan", artist: "Taylor Swift", energy: 0.25, valence: 0.37, danceability: 0.38, acousticness: 0.81, plays: 38 },
  { name: "Olivia", artist: "Harry Styles", energy: 0.68, valence: 0.78, danceability: 0.67, acousticness: 0.24, plays: 29 },
  { name: "As It Was", artist: "Harry Styles", energy: 0.65, valence: 0.43, danceability: 0.70, acousticness: 0.36, plays: 41 },
  { name: "Heat Waves", artist: "Glass Animals", energy: 0.76, valence: 0.56, danceability: 0.76, acousticness: 0.11, plays: 33 },
  { name: "Good 4 U", artist: "Olivia Rodrigo", energy: 0.78, valence: 0.43, danceability: 0.56, acousticness: 0.20, plays: 24 },
];

// Character playlists
const characterPlaylists: CharacterPlaylist[] = [
  {
    name: "Conrad",
    color: "from-blue-600 via-blue-500 to-cyan-400",
    emoji: "🌊",
    vibe: "Moody & Introspective",
    avgEnergy: 0.35,
    avgValence: 0.28,
    tracks: [
      { name: "This Love (Taylor's Version)", artist: "Taylor Swift", energy: 0.32, valence: 0.21, danceability: 0.35, acousticness: 0.72, plays: 0 },
      { name: "August", artist: "Taylor Swift", energy: 0.24, valence: 0.23, danceability: 0.41, acousticness: 0.73, plays: 0 },
      { name: "Cardigan", artist: "Taylor Swift", energy: 0.25, valence: 0.37, danceability: 0.38, acousticness: 0.81, plays: 0 },
      { name: "Skinny Love", artist: "Bon Iver", energy: 0.23, valence: 0.15, danceability: 0.32, acousticness: 0.88, plays: 0 },
    ]
  },
  {
    name: "Jeremiah",
    color: "from-orange-400 via-amber-400 to-yellow-300",
    emoji: "☀️",
    vibe: "Sunny & Upbeat",
    avgEnergy: 0.74,
    avgValence: 0.68,
    tracks: [
      { name: "Cruel Summer", artist: "Taylor Swift", energy: 0.73, valence: 0.56, danceability: 0.55, acousticness: 0.11, plays: 0 },
      { name: "Olivia", artist: "Harry Styles", energy: 0.68, valence: 0.78, danceability: 0.67, acousticness: 0.24, plays: 0 },
      { name: "Heat Waves", artist: "Glass Animals", energy: 0.76, valence: 0.56, danceability: 0.76, acousticness: 0.11, plays: 0 },
      { name: "Sunflower", artist: "Post Malone", energy: 0.76, valence: 0.91, danceability: 0.76, acousticness: 0.56, plays: 0 },
    ]
  },
  {
    name: "Belly",
    color: "from-pink-400 via-rose-400 to-purple-400",
    emoji: "💕",
    vibe: "Coming-of-Age Mix",
    avgEnergy: 0.52,
    avgValence: 0.48,
    tracks: [
      { name: "Good 4 U", artist: "Olivia Rodrigo", energy: 0.78, valence: 0.43, danceability: 0.56, acousticness: 0.20, plays: 0 },
      { name: "As It Was", artist: "Harry Styles", energy: 0.65, valence: 0.43, danceability: 0.70, acousticness: 0.36, plays: 0 },
      { name: "Deja Vu", artist: "Olivia Rodrigo", energy: 0.41, valence: 0.33, danceability: 0.57, acousticness: 0.54, plays: 0 },
      { name: "22 (Taylor's Version)", artist: "Taylor Swift", energy: 0.68, valence: 0.84, danceability: 0.58, acousticness: 0.13, plays: 0 },
    ]
  }
];

interface TSITPWrappedProps {
  onBack: () => void;
}

export function TSITPWrapped({ onBack }: TSITPWrappedProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    // Calculate user stats
    const totalPlays = mockUserTracks.reduce((sum, track) => sum + track.plays, 0);
    const avgEnergy = mockUserTracks.reduce((sum, track) => sum + track.energy, 0) / mockUserTracks.length;
    const avgValence = mockUserTracks.reduce((sum, track) => sum + track.valence, 0) / mockUserTracks.length;
    const topTrack = mockUserTracks.sort((a, b) => b.plays - a.plays)[0];
    
    // Character matching
    const characterScores = characterPlaylists.map(character => {
      const energyDiff = Math.abs(character.avgEnergy - avgEnergy);
      const valenceDiff = Math.abs(character.avgValence - avgValence);
      const score = 1 - (energyDiff + valenceDiff) / 2;
      return { ...character, score };
    });
    
    const bestMatch = characterScores.sort((a, b) => b.score - a.score)[0];
    
    // Team assignment
    const teamConradScore = avgValence < 0.4 && avgEnergy < 0.5 ? 0.8 : 0.3;
    const teamJeremiahScore = 1 - teamConradScore;
    
    setUserStats({
      totalPlays,
      avgEnergy,
      avgValence,
      topTrack,
      bestMatch,
      teamConradScore: teamConradScore * 100,
      teamJeremiahScore: teamJeremiahScore * 100,
      summerMood: avgValence > 0.5 ? "Sunny" : avgValence > 0.3 ? "Bittersweet" : "Moody"
    });
  }, []);

  const slides = [
    // Welcome
    {
      title: "Your TSITP Summer Wrapped",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl">🏖️</div>
          <p className="text-xl text-gray-600">
            Ready to see how your music taste matches the Cousins Beach crew?
          </p>
          <div className="bg-white/50 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Based on your summer listening from June - August 2024
            </p>
          </div>
        </div>
      )
    },
    
    // Summer Stats
    {
      title: "Your Summer in Numbers",
      content: userStats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/70">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{userStats.totalPlays}</div>
                <div className="text-sm text-gray-600">Total Summer Plays</div>
              </CardContent>
            </Card>
            <Card className="bg-white/70">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-pink-500">{userStats.topTrack.plays}</div>
                <div className="text-sm text-gray-600">Times you played "{userStats.topTrack.name}"</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white/70">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Your Summer Anthem</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium">{userStats.topTrack.name}</div>
                  <div className="text-sm text-gray-600">{userStats.topTrack.artist}</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Just like Belly thinking about Conrad on repeat 💭
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    
    // Character Match
    {
      title: "Your Character Match",
      content: userStats && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{userStats.bestMatch.emoji}</div>
            <h2 className="text-2xl font-bold mb-2">You're a {userStats.bestMatch.name}!</h2>
            <Badge className={`bg-gradient-to-r ${userStats.bestMatch.color} text-white`}>
              {userStats.bestMatch.vibe}
            </Badge>
          </div>
          
          <Card className="bg-white/70">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Why you match {userStats.bestMatch.name}:</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Music Energy</span>
                  <div className="flex items-center gap-2">
                    <Progress value={userStats.avgEnergy * 100} className="w-20" />
                    <span className="text-sm">{Math.round(userStats.avgEnergy * 100)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Positivity Vibe</span>
                  <div className="flex items-center gap-2">
                    <Progress value={userStats.avgValence * 100} className="w-20" />
                    <span className="text-sm">{Math.round(userStats.avgValence * 100)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50/80 rounded-lg border border-blue-200/40">
                <p className="text-sm text-gray-700">
                  {userStats.bestMatch.name === "Conrad" && "Your taste for introspective, moody tracks matches Conrad's deep, thoughtful nature - like late night walks on the beach."}
                  {userStats.bestMatch.name === "Jeremiah" && "Your love for upbeat, sunny songs reflects Jeremiah's optimistic and fun personality - pure golden hour vibes."}
                  {userStats.bestMatch.name === "Belly" && "Your mix of coming-of-age anthems and emotional tracks captures Belly's journey perfectly - the magic of summers at Cousins Beach."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    
    // Team Analysis
    {
      title: "Team Conrad vs Team Jeremiah",
      content: userStats && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Based on your music vibes...</h2>
          </div>
          
          <div className="space-y-4">
            <Card className="bg-white/70">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-slate-600" />
                    <span className="font-medium">Team Conrad</span>
                  </div>
                  <span className="font-bold">{Math.round(userStats.teamConradScore)}%</span>
                </div>
                <Progress value={userStats.teamConradScore} className="mb-2" />
                <p className="text-xs text-gray-600">Moody indie vibes • Introspective ballads</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Team Jeremiah</span>
                  </div>
                  <span className="font-bold">{Math.round(userStats.teamJeremiahScore)}%</span>
                </div>
                <Progress value={userStats.teamJeremiahScore} className="mb-2" />
                <p className="text-xs text-gray-600">Sunny pop hits • Feel-good anthems</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white/50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              You're <strong>{userStats.teamConradScore > userStats.teamJeremiahScore ? "Team Conrad" : "Team Jeremiah"}</strong> based on your summer playlist!
            </p>
          </div>
        </div>
      )
    },
    
    // Summer Mood
    {
      title: "Your Summer Mood",
      content: userStats && (
        <div className="space-y-6 text-center">
          <div>
            <div className="text-6xl mb-4">
              {userStats.summerMood === "Sunny" ? "☀️" : userStats.summerMood === "Bittersweet" ? "🌅" : "🌙"}
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Summer Was {userStats.summerMood}</h2>
          </div>
          
          <Card className="bg-white/70">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-4">
                {userStats.summerMood === "Sunny" && "Your playlist was full of upbeat, positive tracks that screamed summer fun!"}
                {userStats.summerMood === "Bittersweet" && "You balanced happy summer hits with some deeper, more emotional tracks."}
                {userStats.summerMood === "Moody" && "Your summer soundtrack leaned introspective - perfect for those deep beach walks."}
              </p>
              
              <div className="text-xs text-gray-500">
                Just like {userStats.summerMood === "Sunny" ? "Jeremiah's golden hour energy" : 
                         userStats.summerMood === "Bittersweet" ? "Belly's coming-of-age journey" : 
                         "Conrad's contemplative beach moments"}
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-gradient-to-r from-blue-100 to-pink-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              "The summer that changed everything" 🏖️
            </p>
          </div>
        </div>
      )
    },
    
    // Share
    {
      title: "Share Your TSITP Wrapped",
      content: (
        <div className="space-y-6 text-center">
          <div className="text-4xl">📱</div>
          <p className="text-lg">Ready to share your results?</p>
          
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 hover:opacity-90 shadow-md">
              <Share className="w-4 h-4 mr-2" />
              Share to Instagram Stories
            </Button>
            <Button variant="outline" className="w-full border-purple-300/50 hover:bg-purple-50/50">
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
          </div>
          
          <div className="bg-blue-50/60 rounded-lg p-4 border border-blue-200/40">
            <p className="text-xs text-gray-600">
              Tag us @tsitpwrapped and use #TSITPWrapped to see other fans' results!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl">
          <CardHeader className="text-center border-b border-gray-100">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-lg bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </CardTitle>
              <div className="w-8" />
            </div>
            <div className="flex justify-center space-x-1 mt-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? 'bg-pink-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="p-6 min-h-[400px] flex items-center">
            {slides[currentSlide].content}
          </CardContent>
          
          <div className="flex justify-between p-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="border-blue-300/50 hover:bg-blue-50/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 hover:opacity-90 shadow-md"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}