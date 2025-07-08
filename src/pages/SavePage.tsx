import React, { createElement } from 'react';
import { DownloadIcon, ShareIcon, RefreshCwIcon } from 'lucide-react';
interface SavePageProps {
  finalImage: string | null;
  onReset: () => void;
}
const SavePage: React.FC<SavePageProps> = ({
  finalImage,
  onReset
}) => {
  const handleDownload = () => {
    if (!finalImage) return;
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = `cargo_${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleShare = async () => {
    if (!finalImage || !navigator.share) return;
    try {
      // Convert base64 to blob
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const file = new File([blob], `cargo_${new Date().getTime()}.jpg`, {
        type: 'image/jpeg'
      });
      await navigator.share({
        title: 'Cargo Image with QR Code',
        files: [file]
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  return <div className="flex flex-col w-full min-h-screen p-6 animate-fadeIn">
      <div className="w-full max-w-md mx-auto mt-6">
        <h1 className="text-2xl font-bold text-center">Save & Share</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2 mb-6">
          Your cargo image is ready!
        </p>
      </div>
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
          {finalImage && <img src={finalImage} alt="Final cargo with QR code" className="w-full h-auto" />}
        </div>
        <div className="space-y-4 mb-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Your image includes the QR code with all cargo details embedded. The
            QR code can be scanned to retrieve the information.
          </p>
          <div className="flex flex-col space-y-3">
            <button onClick={handleDownload} className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download Image
            </button>
            {navigator.share && <button onClick={handleShare} className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                <ShareIcon className="w-5 h-5 mr-2" />
                Share Image
              </button>}
            <button onClick={onReset} className="w-full py-4 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
              <RefreshCwIcon className="w-5 h-5 mr-2" />
              Start New Capture
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default SavePage;