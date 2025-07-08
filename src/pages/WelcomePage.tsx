import React from 'react';
import { CameraIcon, Package2Icon, QrCodeIcon, ShareIcon, MapPinIcon } from 'lucide-react';
interface WelcomePageProps {
  onNext: () => void;
}
const WelcomePage: React.FC<WelcomePageProps> = ({
  onNext
}) => {
  return <div className="flex flex-col items-center justify-between w-full h-screen p-6 animate-fadeIn">
      <div className="w-full max-w-md mt-10">
        <h1 className="text-3xl font-bold text-center mb-2">Cargo Capture</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          Document your cargo with photos, details, and embedded QR codes
        </p>
      </div>
      <div className="w-full max-w-md space-y-8 my-8">
        <FeatureCard icon={<CameraIcon className="w-6 h-6 text-orange-500" />} title="Capture Photos" description="Take photos of your cargo items using your camera" />
        <FeatureCard icon={<Package2Icon className="w-6 h-6 text-orange-500" />} title="Record Details" description="Document dimensions, weight, and other cargo information" />
        <FeatureCard icon={<MapPinIcon className="w-6 h-6 text-orange-500" />} title="Track Location" description="Add GPS coordinates to your cargo data for tracking" />
        <FeatureCard icon={<QrCodeIcon className="w-6 h-6 text-orange-500" />} title="Generate QR Codes" description="Create QR codes with all cargo data embedded" />
        <FeatureCard icon={<ShareIcon className="w-6 h-6 text-orange-500" />} title="Save & Share" description="Store or share the final image with embedded data" />
      </div>
      <div className="w-full max-w-md mb-10">
        <button onClick={onNext} className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
          <span>Start New Cargo Entry</span>
          <CameraIcon className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>;
};
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description
}) => {
  return <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-2 bg-orange-100 dark:bg-gray-700 rounded-lg mr-4">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </div>
    </div>;
};
export default WelcomePage;