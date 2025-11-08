
import React from 'react';

interface SummaryProps {
  totalBiaya: number;
  totalUpah: number;
}

const SummaryCard = ({ title, value, colorClass }: { title: string, value: number, colorClass: string }) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div className={`p-6 rounded-lg shadow-lg ${colorClass}`}>
      <h3 className="text-lg font-medium text-white/80">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{formatter.format(value)}</p>
    </div>
  );
};


const Summary: React.FC<SummaryProps> = ({ totalBiaya, totalUpah }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <SummaryCard title="Total Biaya Proyek" value={totalBiaya} colorClass="bg-primary-700 dark:bg-primary-800" />
      <SummaryCard title="Total Upah Kerja" value={totalUpah} colorClass="bg-green-600 dark:bg-green-700" />
    </div>
  );
};

export default Summary;
