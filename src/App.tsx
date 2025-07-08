import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import CameraPage from './pages/CameraPage';
import FormPage from './pages/FormPage';
import PreviewPage from './pages/PreviewPage';
import SavePage from './pages/SavePage';
type CargoData = {
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
};
export function App() {
  const [step, setStep] = useState<'welcome' | 'camera' | 'form' | 'preview' | 'save'>('welcome');
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [cargoData, setCargoData] = useState<CargoData>({
    id: '',
    description: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    notes: '',
    useCm: true,
    useKg: true,
    location: {
      latitude: null,
      longitude: null,
      timestamp: null
    }
  });
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const goToStep = (newStep: 'welcome' | 'camera' | 'form' | 'preview' | 'save') => {
    setStep(newStep);
  };
  return <div className="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {step === 'welcome' && <WelcomePage onNext={() => goToStep('camera')} />}
      {step === 'camera' && <CameraPage onCapture={src => {
      setPhotoSrc(src);
      goToStep('form');
    }} />}
      {step === 'form' && <FormPage cargoData={cargoData} setCargoData={setCargoData} onNext={() => goToStep('preview')} onBack={() => goToStep('camera')} />}
      {step === 'preview' && <PreviewPage photoSrc={photoSrc} cargoData={cargoData} setQrCodeData={setQrCodeData} setFinalImage={setFinalImage} onNext={() => goToStep('save')} onBack={() => goToStep('form')} />}
      {step === 'save' && <SavePage finalImage={finalImage} onReset={() => {
      setStep('welcome');
      setPhotoSrc(null);
      setCargoData({
        id: '',
        description: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        notes: '',
        useCm: true,
        useKg: true,
        location: {
          latitude: null,
          longitude: null,
          timestamp: null
        }
      });
      setQrCodeData(null);
      setFinalImage(null);
    }} />}
    </div>;
}