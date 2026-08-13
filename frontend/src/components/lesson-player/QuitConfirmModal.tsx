import React from 'react';

interface QuitConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function QuitConfirmModal({ onConfirm, onCancel }: QuitConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-[400px] w-full flex flex-col items-center text-center animate-in zoom-in-95">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Are you sure you want to quit?</h2>
        <p className="text-gray-500 mb-8 font-bold">
          All progress for this lesson will be lost.
        </p>
        
        <div className="w-full space-y-4">
          <button
            onClick={onCancel}
            className="w-full py-4 rounded-2xl bg-blue-400 hover:bg-blue-500 border-b-4 border-blue-600 text-white font-bold text-lg transition-all"
          >
            KEEP LEARNING
          </button>
          
          <button
            onClick={onConfirm}
            className="w-full py-4 rounded-2xl bg-white hover:bg-gray-100 border-2 border-gray-200 text-red-500 font-bold text-lg transition-all"
          >
            END SESSION
          </button>
        </div>
      </div>
    </div>
  );
}
