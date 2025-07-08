import React, { useState, useRef } from 'react';
import { CameraIcon, RefreshCwIcon } from 'lucide-react';
interface CameraPageProps {
  onCapture: (imageSrc: string) => void;
}
const CameraPage: React.FC<CameraPageProps> = ({
  onCapture
}) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewSrc(result);
      };
      reader.readAsDataURL(file);
    }
  };
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const resetCapture = () => {
    setPreviewSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const confirmCapture = () => {
    if (previewSrc) {
      onCapture(previewSrc);
    }
  };
  return <div className="flex flex-col items-center justify-between w-full h-screen p-6 animate-fadeIn">
      <div className="w-full max-w-md mt-6">
        <h1 className="text-2xl font-bold text-center">Capture Cargo Photo</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2 mb-6">
          Take a clear photo of your cargo item
        </p>
      </div>
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" />
        {previewSrc ? <div className="w-full h-full max-h-[70vh] flex flex-col items-center">
            <div className="relative w-full h-full max-h-[70vh] rounded-xl overflow-hidden shadow-lg mb-4">
              <img src={previewSrc} alt="Captured cargo" className="w-full h-full object-cover" />
            </div>
            <div className="flex space-x-4 mt-4 w-full justify-center">
              <button onClick={resetCapture} className="flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <RefreshCwIcon className="w-5 h-5 mr-2" />
                Retake
              </button>
              <button onClick={confirmCapture} className="flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                Use This Photo
              </button>
            </div>
          </div> : <div className="w-full flex flex-col items-center">
            <div className="w-full h-[50vh] bg-gray-200 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center mb-6 border-2 border-dashed border-gray-300 dark:border-gray-700" onClick={triggerFileInput}>
              <CameraIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-center px-6">
                Tap here to capture a photo of your cargo
              </p>
            </div>
            <button onClick={triggerFileInput} className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
              <CameraIcon className="w-5 h-5 mr-2" />
              Capture Photo
            </button>
          </div>}
      </div>
    </div>;
};
export default CameraPage;