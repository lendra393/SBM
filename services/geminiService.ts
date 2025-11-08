import { GoogleGenAI, Type } from "@google/genai";
import * as XLSX from 'xlsx';
import { RABItem } from '../types';

const excelToCsvText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            try {
                const data = event.target?.result;
                if (!data) {
                    reject(new Error("Gagal membaca data file."));
                    return;
                }
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const csvData = XLSX.utils.sheet_to_csv(worksheet);
                resolve(csvData);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};


const rabSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        uraian: { 
            type: Type.STRING, 
            description: "Deskripsi atau nama pekerjaan. Contoh: 'Pekerjaan Galian Tanah'." 
        },
        volume: { 
            type: Type.NUMBER, 
            description: "Volume atau kuantitas pekerjaan. Ambil hanya angkanya." 
        },
        satuan: { 
            type: Type.STRING, 
            description: "Satuan unit untuk volume. Contoh: 'm3', 'm2', 'ls'." 
        },
        hargaUpah: { 
            type: Type.NUMBER, 
            description: "Harga satuan untuk upah atau tenaga kerja. Jika tidak ada, isi 0." 
        },
        hargaBahan: { 
            type: Type.NUMBER, 
            description: "Harga satuan untuk material atau bahan. Jika tidak ada, isi 0."
        },
      },
      required: ["uraian", "volume", "satuan", "hargaUpah", "hargaBahan"],
    },
  };

export const parseRABFromExcel = async (file: File): Promise<RABItem[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const csvText = await excelToCsvText(file);

  const prompt = `
    Anda adalah seorang ahli Quantity Surveyor yang sangat teliti. Tugas Anda adalah membaca data CSV yang diekstrak dari Rencana Anggaran Biaya (RAB) dan mengubahnya ke dalam format JSON yang terstruktur.

    Data CSV berikut ini dipisahkan oleh koma:
    ---
    ${csvText}
    ---

    Perhatikan instruksi berikut dengan seksama:
    1.  Baris pertama mungkin berisi header kolom. Identifikasi kolom untuk 'uraian' (deskripsi pekerjaan), 'volume', 'satuan', 'hargaUpah' (harga satuan untuk upah/pekerja), dan 'hargaBahan' (harga satuan untuk material/bahan). Nama kolom mungkin sedikit berbeda, jadi gunakan logika Anda untuk mencocokkannya.
    2.  Proses setiap baris data setelah header sebagai item pekerjaan. Abaikan baris yang jelas-jelas merupakan sub-total, total keseluruhan, atau baris kosong.
    3.  Jika kolom untuk harga upah atau harga bahan tidak ada, kosong, atau tidak relevan untuk sebuah item, anggap nilainya adalah 0.
    4.  Pastikan semua nilai numerik (volume, hargaUpah, hargaBahan) diekstrak sebagai angka, bukan teks. Hapus simbol mata uang (seperti 'Rp') atau pemisah ribuan (seperti '.' atau ',').
    5.  Hasil akhir HARUS berupa array JSON saja, tanpa teks tambahan, penjelasan, atau format markdown.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // FIX: The `contents` property for a single text prompt should be a string, not an object with a `parts` array.
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: rabSchema,
      },
    });

    const parsedJsonText = response.text.trim();
    const parsedData: Omit<RABItem, 'id'>[] = JSON.parse(parsedJsonText);

    // Add unique IDs to each item
    return parsedData.map(item => ({
      ...item,
      id: crypto.randomUUID(),
    }));

  } catch (error) {
    console.error("Error processing with Gemini API:", error);
    throw new Error("Gagal mem-parsing file Excel dengan AI. File mungkin rusak atau format konten RAB tidak dikenali.");
  }
};