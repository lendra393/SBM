
export interface RABItem {
  id: string;
  uraian: string;
  volume: number;
  satuan: string;
  hargaUpah: number;
  hargaBahan: number;
}

export type NewRABItem = Omit<RABItem, 'id'>;
