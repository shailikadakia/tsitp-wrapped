import React from 'react';


export function WelcomeSlide() {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">🏖️</div>
      <p className="text-xl text-gray-600">
        Ready to see how your music taste matches the Cousins Beach crew?
      </p>
      <div className="bg-white/50 rounded-lg p-4">
        <p className="text-sm text-gray-500">
          Based on your top 50 tracks this year
        </p>
      </div>
    </div>
  );
}
