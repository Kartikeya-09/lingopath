"use client";

import React, { useState } from 'react';
import { Settings, Volume2, Sparkles, Target } from 'lucide-react';

interface ToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`toggle-switch ${value ? 'active' : 'inactive'}`}
      role="switch"
      aria-checked={value}
    />
  );
}

export default function SettingsPage() {
  const [sound, setSound] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(50);

  const goalOptions = [
    { label: 'Casual', value: 10, emoji: '🌱' },
    { label: 'Regular', value: 20, emoji: '🌿' },
    { label: 'Serious', value: 30, emoji: '🌳' },
    { label: 'Intense', value: 50, emoji: '🔥' },
  ];

  return (
    <div className="max-w-[600px] mx-auto p-6 pb-32">
      <div className="flex items-center space-x-3 mb-8">
        <Settings className="w-10 h-10 text-[#b8c5cc]" />
        <h1 className="text-2xl font-extrabold text-[#f7f7f7]">Settings</h1>
      </div>

      {/* Sound */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Volume2 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Sound effects</h3>
            <p className="text-gray-500 text-sm font-bold">Play sounds during lessons</p>
          </div>
        </div>
        <Toggle value={sound} onChange={setSound} />
      </div>

      {/* Animations */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Animations</h3>
            <p className="text-gray-500 text-sm font-bold">Show celebration animations</p>
          </div>
        </div>
        <Toggle value={animations} onChange={setAnimations} />
      </div>

      {/* Daily Goal */}
      <h2 className="text-lg font-extrabold text-[#b7c4ca] uppercase tracking-[0.5px] mb-4 flex items-center space-x-2">
        <Target className="w-5 h-5 text-[#b7c4ca]" />
        <span>Daily Goal</span>
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {goalOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDailyGoal(opt.value)}
            className={`p-5 rounded-2xl border-2 text-center transition-all ${
              dailyGoal === opt.value
                ? 'bg-blue-50 border-blue-400 text-blue-600'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="text-3xl mb-2">{opt.emoji}</div>
            <h3 className="font-bold text-lg text-gray-800">{opt.label}</h3>
            <p className="text-sm font-bold text-gray-600">{opt.value} XP / day</p>
          </button>
        ))}
      </div>
    </div>
  );
}
