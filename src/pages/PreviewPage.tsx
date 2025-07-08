import React, { useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, QrCodeIcon, MapPinIcon } from 'lucide-react';
import QRCode from 'qrcode';
interface CargoData {
  id: string;
  description: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  notes: string;
  useCm: boolean;
  useKg: boolean;
  location: {
    latitude: number | null;
    longitude: number | null;
    timestamp: number | null;
  };
}
interface PreviewPageProps {
  photoSrc: string | null;
  cargoData: CargoData;
  setQrCodeData: React.Dispatch<React.SetStateAction<string | null>>;
  setFinalImage: React.Dispatch<React.SetStateAction<string | null>>;
  onNext: () => void;
  onBack: () => void;
}
const PreviewPage: React.FC<PreviewPageProps> = ({
  photoSrc,
  cargoData,
  setQrCodeData,
  setFinalImage,
  onNext,
  onBack
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  // Generate QR code data and canvas
  useEffect(() => {
    const qrData = JSON.stringify({
      id: cargoData.id,
      desc: cargoData.description,
      dim: {
        l: cargoData.length,
        w: cargoData.width,
        h: cargoData.height,
        unit: cargoData.useCm ? 'cm' : 'in'
      },
      wt: {
        val: cargoData.weight,
        unit: cargoData.useKg ? 'kg' : 'lb'
      },
      notes: cargoData.notes,
      loc: cargoData.location.latitude ? {
        lat: cargoData.location.latitude,
        lng: cargoData.location.longitude,
        ts: cargoData.location.timestamp
      } : null
    });
    setQrCodeData(qrData);
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    }
  }, [cargoData, setQrCodeData]);
  // Generate final image with QR code overlay
  useEffect(() => {
    if (!photoSrc || !canvasRef.current || !qrCanvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw the original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Calculate QR code size and position
      const qrSize = Math.min(canvas.width * 0.25, canvas.height * 0.25);
      const padding = 20;
      const qrX = canvas.width - qrSize - padding;
      const qrY = canvas.height - qrSize - padding;
      // Draw semi-transparent background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
      // Draw QR code
      ctx.drawImage(qrCanvasRef.current, qrX, qrY, qrSize, qrSize);
      // Add cargo ID as text above QR code
      ctx.font = `bold ${Math.max(16, canvas.width * 0.03)}px sans-serif`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.textAlign = 'right';
      ctx.fillText(`ID: ${cargoData.id}`, canvas.width - padding, qrY - 15);
      // Save the final image
      const finalImageData = canvas.toDataURL('image/jpeg', 0.9);
      setFinalImage(finalImageData);
    };
    img.src = photoSrc;
  }, [photoSrc, cargoData, setFinalImage]);
  const formatCoordinate = (coord: number | null): string => {
    if (coord === null) return '—';
    return coord.toFixed(6);
  };
  return <div className="flex flex-col w-full min-h-screen p-6 animate-fadeIn">
      <div className="w-full max-w-md mx-auto mt-6">
        <h1 className="text-2xl font-bold text-center">Preview & QR Code</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2 mb-6">
          Review your cargo image with embedded QR code
        </p>
      </div>
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md mb-6">
          <div className="flex items-center mb-4">
            <QrCodeIcon className="w-5 h-5 text-orange-500 mr-2" />
            <h2 className="font-medium">Cargo Data QR Code</h2>
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-white p-2 rounded-lg">
              <canvas ref={qrCanvasRef} className="w-[150px] h-[150px]" />
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-1">Encoded cargo information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ID: {cargoData.id}</li>
              <li>Description: {cargoData.description}</li>
              <li>
                Dimensions: {cargoData.length} × {cargoData.width} ×{' '}
                {cargoData.height} {cargoData.useCm ? 'cm' : 'in'}
              </li>
              <li>
                Weight: {cargoData.weight} {cargoData.useKg ? 'kg' : 'lbs'}
              </li>
              {cargoData.location.latitude !== null && <li className="flex items-start">
                  <MapPinIcon className="w-4 h-4 text-orange-500 mr-1 mt-0.5 flex-shrink-0" />
                  <span>
                    Location: {formatCoordinate(cargoData.location.latitude)},{' '}
                    {formatCoordinate(cargoData.location.longitude)}
                  </span>
                </li>}
              {cargoData.notes && <li>Notes: {cargoData.notes}</li>}
            </ul>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md mb-6">
          <div className="relative w-full">
            <canvas ref={canvasRef} className="w-full h-auto" />
          </div>
        </div>
        <div className="flex justify-between mt-auto mb-6">
          <button onClick={onBack} className="flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </button>
          <button onClick={onNext} className="flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
            Save & Share
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>;
};
export default PreviewPage;