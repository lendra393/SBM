
import React from 'react';
import { RABItem } from '../types';
import { TrashIcon } from './icons';

interface RABTableProps {
  items: RABItem[];
  onDeleteItem: (id: string) => void;
}

const RABTable: React.FC<RABTableProps> = ({ items, onDeleteItem }) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  const totalUpah = items.reduce((acc, item) => acc + item.volume * item.hargaUpah, 0);
  const totalBahan = items.reduce((acc, item) => acc + item.volume * item.hargaBahan, 0);
  const totalBiaya = totalUpah + totalBahan;

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Belum Ada Data RAB</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Silakan tambahkan item secara manual atau unggah file Excel untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Uraian Pekerjaan</th>
              <th scope="col" className="px-6 py-3 text-right">Volume</th>
              <th scope="col" className="px-6 py-3">Satuan</th>
              <th scope="col" className="px-6 py-3 text-right">Harga Satuan Upah</th>
              <th scope="col" className="px-6 py-3 text-right">Harga Satuan Bahan</th>
              <th scope="col" className="px-6 py-3 text-right">Jumlah Harga Upah</th>
              <th scope="col" className="px-6 py-3 text-right">Jumlah Harga Bahan</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const jumlahHargaUpah = item.volume * item.hargaUpah;
              const jumlahHargaBahan = item.volume * item.hargaBahan;
              return (
                <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">{index + 1}</td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.uraian}</th>
                  <td className="px-6 py-4 text-right">{item.volume.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">{item.satuan}</td>
                  <td className="px-6 py-4 text-right">{formatter.format(item.hargaUpah)}</td>
                  <td className="px-6 py-4 text-right">{formatter.format(item.hargaBahan)}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-gray-200">{formatter.format(jumlahHargaUpah)}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-gray-200">{formatter.format(jumlahHargaBahan)}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => onDeleteItem(item.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
           <tfoot className="font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">
                <tr>
                    <td colSpan={6} className="px-6 py-3 text-right text-base">Total Biaya</td>
                    <td className="px-6 py-3 text-right text-base">{formatter.format(totalUpah)}</td>
                    <td className="px-6 py-3 text-right text-base">{formatter.format(totalBahan)}</td>
                    <td className="px-6 py-3 text-center text-base font-bold bg-primary-100 dark:bg-primary-900">{formatter.format(totalBiaya)}</td>
                </tr>
            </tfoot>
        </table>
      </div>
    </div>
  );
};

export default RABTable;
