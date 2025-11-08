import React, { useState, useMemo } from 'react';
import { RABItem, NewRABItem } from './types';
import { parseRABFromExcel } from './services/geminiService';
import ManualInputForm from './components/ManualInputForm';
import ExcelUploader from './components/ExcelUploader';
import RABTable from './components/RABTable';
import Summary from './components/Summary';
import { TableIcon, FileIcon } from './components/icons';

type InputMode = 'manual' | 'excel';

// FIX: Moved TabButton outside the App component to prevent re-creation on each render and to resolve props-related compiler errors.
// It now receives state and handlers as props for better component isolation.
interface TabButtonProps {
  mode: InputMode;
  currentMode: InputMode;
  onClick: (mode: InputMode) => void;
  children: React.ReactNode;
}

const TabButton = ({ mode, currentMode, onClick, children }: TabButtonProps) => (
  <button
    onClick={() => onClick(mode)}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      currentMode === mode
        ? 'bg-primary-600 text-white'
        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);


const App: React.FC = () => {
  const [rabItems, setRabItems] = useState<RABItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('excel');

  const handleAddItem = (item: NewRABItem) => {
    setRabItems(prevItems => [
      ...prevItems,
      { ...item, id: crypto.randomUUID() },
    ]);
  };

  const handleDeleteItem = (id: string) => {
    setRabItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsedItems = await parseRABFromExcel(file);
      setRabItems(parsedItems);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const { totalUpah, totalBiaya } = useMemo(() => {
    const totalUpah = rabItems.reduce((acc, item) => acc + item.volume * item.hargaUpah, 0);
    const totalBahan = rabItems.reduce((acc, item) => acc + item.volume * item.hargaBahan, 0);
    const totalBiaya = totalUpah + totalBahan;
    return { totalUpah, totalBiaya };
  }, [rabItems]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            Sistem Perhitungan RAB
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Analisis Anggaran Biaya dengan Bantuan AI
          </p>
        </header>
        
        <main>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Input Data</h2>
            <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              <TabButton mode="excel" currentMode={inputMode} onClick={setInputMode}>
                <FileIcon className="w-5 h-5" /> Unggah Excel
              </TabButton>
              <TabButton mode="manual" currentMode={inputMode} onClick={setInputMode}>
                <TableIcon className="w-5 h-5" /> Input Manual
              </TabButton>
            </div>
            
            {inputMode === 'excel' ? (
                <ExcelUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
            ) : (
                <ManualInputForm onAddItem={handleAddItem} />
            )}
          </div>

          <div className="space-y-8">
             <Summary totalBiaya={totalBiaya} totalUpah={totalUpah} />
            <div>
              <h2 className="text-2xl font-semibold mb-4">Detail Anggaran Biaya</h2>
              <RABTable items={rabItems} onDeleteItem={handleDeleteItem} />
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by Gemini AI. Dibuat dengan React & Tailwind CSS.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;