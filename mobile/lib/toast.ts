// Tiny toast queue + a fire-anywhere helper.
//   import { toast } from '@/lib/toast';
//   toast.success('Logged in 🎉');  toast.error('Could not reach the server');
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
  show: (type: ToastType, message: string, duration?: number) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (type, message, duration = 2800) =>
    set((s) => ({ toasts: [...s.toasts, { id: ++counter, type, message, duration }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().show('success', message, duration),
  error: (message: string, duration?: number) =>
    useToastStore.getState().show('error', message, duration),
  info: (message: string, duration?: number) =>
    useToastStore.getState().show('info', message, duration),
};
