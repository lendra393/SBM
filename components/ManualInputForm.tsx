
import React, { useState } from 'react';
import { NewRABItem } from '../types';
import { PlusIcon } from './icons';

interface ManualInputFormProps {
  onAddItem: (item: NewRABItem) => void;
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({ onAddItem }) => {
  const [uraian, setUraian] = useState('');
  const [volume, setVolume] = useState('');
  const [satuan, setSatuan] = useState('');
  const [hargaUpah, setHargaUpah] = useState('');
  const [hargaBahan, setHargaBahan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraian || !volume || !satuan) {
      alert("Uraian, Volume, and Satuan are required.");
      return;
    }
    onAddItem({
      uraian,
      volume: parseFloat(volume) || 0,
      satuan,
      hargaUpah: parseFloat(hargaUpah) || 0,
      hargaBahan: parseFloat(hargaBahan) || 0,
    });
    // Reset form
    setUraian('');
    setVolume('');
    setSatuan('');
    setHargaUpah('');
    setHargaBahan('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label htmlFor="uraian" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Uraian Pekerjaan</label>
          <input type="text" id="uraian" value={uraian} onChange={e => setUraian(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
        </div>
        <div>
          <label htmlFor="volume" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Volume</label>
          <input type="number" id="volume" value={volume} onChange={e => setVolume(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
        </div>
        <div>
          <label htmlFor="satuan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Satuan</label>
          <input type="text" id="satuan" value={satuan} onChange={e => setSatuan(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required placeholder="e.g., m2, m3, ls"/>
        </div>
         <div>
          <label htmlFor="hargaUpah" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga Satuan Upah</label>
          <input type="number" id="hargaUpah" value={hargaUpah} onChange={e => setHargaUpah(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="0"/>
        </div>
        <div>
          <label htmlFor="hargaBahan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga Satuan Bahan</label>
          <input type="number" id="hargaBahan" value={hargaBahan} onChange={e => setHargaBahan(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="0"/>
        </div>
        <div className="flex items-end col-span-1 md:col-span-2 lg:col-span-1">
          <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
            <PlusIcon className="w-5 h-5"/>
            Tambah Item
          </button>
        </div>
      </div>
    </form>
  );
};

export default ManualInputForm;
