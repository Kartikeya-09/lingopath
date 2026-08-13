import React, { useEffect } from 'react';
import { create } from 'zustand';
import { X } from 'lucide-react';

interface ToastData {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface ToastState {
  toasts: ToastData[];
  addToast: (message: string, type?: 'info' | 'error' | 'success') => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-xl shadow-lg text-white font-bold min-w-[250px] animate-in slide-in-from-right ${
            toast.type === 'error' ? 'bg-red-500' : toast.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-4 hover:opacity-75">
            <X size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
