import { PlaceDetailsResponse } from '@/lib/types';
import { create } from 'zustand';

type PlaceSheetData = PlaceDetailsResponse['result'] & {
  description: string;
};

type PlaceSheetStore = {
  open: boolean;
  data: PlaceSheetData | null;
  openSheet: (data: PlaceSheetData) => void;
  closeSheet: () => void;
};

export const usePlaceSheetStore = create<PlaceSheetStore>((set) => ({
  open: false,
  data: null,
  openSheet: (data: PlaceSheetData) =>
    set({
      open: true,
      data,
    }),
  closeSheet: () => {
    set({ open: false }); // 먼저 open 상태를 false로 변경하여 애니메이션 적용
    setTimeout(() => set({ data: null }), 300); // 애니메이션 시간(300ms) 후 data 초기화
  },
}));
