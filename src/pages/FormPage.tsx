import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, RulerIcon, ScaleIcon, MapPinIcon, LoaderIcon, CheckIcon } from 'lucide-react';
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
interface FormPageProps {
  cargoData: CargoData;
  setCargoData: React.Dispatch<React.SetStateAction<CargoData>>;
  onNext: () => void;
  onBack: () => void;
}
const FormPage: React.FC<FormPageProps> = ({
  cargoData,
  setCargoData,
  onNext,
  onBack
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const updateField = (field: keyof CargoData, value: string | boolean) => {
    setCargoData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const updateLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(position => {
      setCargoData(prev => ({
        ...prev,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp
        }
      }));
      setIsLocating(false);
    }, error => {
      console.error('Error getting location:', error);
      let errorMessage = 'Unable to retrieve location';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location services.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }
      setLocationError(errorMessage);
      setIsLocating(false);
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  };
  const clearLocation = () => {
    setCargoData(prev => ({
      ...prev,
      location: {
        latitude: null,
        longitude: null,
        timestamp: null
      }
    }));
    setLocationError(null);
  };
  const formatCoordinate = (coord: number | null): string => {
    if (coord === null) return '—';
    return coord.toFixed(6);
  };
  const formatDate = (timestamp: number | null): string => {
    if (timestamp === null) return '';
    return new Date(timestamp).toLocaleString();
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };
  return <div className="flex flex-col w-full min-h-screen p-6 animate-fadeIn">
      <div className="w-full max-w-md mx-auto mt-6">
        <h1 className="text-2xl font-bold text-center">Cargo Details</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2 mb-6">
          Enter information about your cargo
        </p>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex-1">
        <div className="space-y-6">
          <div>
            <label htmlFor="cargo-id" className="block text-sm font-medium mb-1">
              Cargo ID
            </label>
            <input id="cargo-id" type="text" required value={cargoData.id} onChange={e => updateField('id', e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Enter cargo ID" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <input id="description" type="text" required value={cargoData.description} onChange={e => updateField('description', e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Brief description of cargo" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Dimensions</label>
              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => updateField('useCm', true)} className={`px-2 py-1 text-xs rounded-md ${cargoData.useCm ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                  cm
                </button>
                <button type="button" onClick={() => updateField('useCm', false)} className={`px-2 py-1 text-xs rounded-md ${!cargoData.useCm ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                  inch
                </button>
                <RulerIcon className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input type="number" required value={cargoData.length} onChange={e => updateField('length', e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Length" />
                <label className="text-xs text-gray-500 mt-1 block">
                  Length
                </label>
              </div>
              <div>
                <input type="number" required value={cargoData.width} onChange={e => updateField('width', e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Width" />
                <label className="text-xs text-gray-500 mt-1 block">
                  Width
                </label>
              </div>
              <div>
                <input type="number" required value={cargoData.height} onChange={e => updateField('height', e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Height" />
                <label className="text-xs text-gray-500 mt-1 block">
                  Height
                </label>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="weight" className="block text-sm font-medium">
                Weight
              </label>
              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => updateField('useKg', true)} className={`px-2 py-1 text-xs rounded-md ${cargoData.useKg ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                  kg
                </button>
                <button type="button" onClick={() => updateField('useKg', false)} className={`px-2 py-1 text-xs rounded-md ${!cargoData.useKg ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                  lbs
                </button>
                <ScaleIcon className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            <input id="weight" type="number" required value={cargoData.weight} onChange={e => updateField('weight', e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder={`Weight in ${cargoData.useKg ? 'kg' : 'lbs'}`} />
          </div>
          {/* GPS Location Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-orange-500 mr-2" />
                <label className="text-sm font-medium">GPS Location</label>
              </div>
              {cargoData.location.latitude !== null ? <button type="button" onClick={clearLocation} className="text-xs text-red-500 hover:text-red-600">
                  Clear
                </button> : <button type="button" onClick={updateLocation} disabled={isLocating} className={`flex items-center px-3 py-1 text-xs rounded-md ${isLocating ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                  {isLocating ? <>
                      <LoaderIcon className="w-3 h-3 mr-1 animate-spin" />
                      Getting location...
                    </> : <>Get Current Location</>}
                </button>}
            </div>
            {locationError && <div className="text-red-500 text-xs mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                {locationError}
              </div>}
            {cargoData.location.latitude !== null && <div className="text-sm">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      Latitude
                    </span>
                    <span className="font-mono">
                      {formatCoordinate(cargoData.location.latitude)}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      Longitude
                    </span>
                    <span className="font-mono">
                      {formatCoordinate(cargoData.location.longitude)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <CheckIcon className="w-3 h-3 mr-1 text-green-500" />
                  Location captured: {formatDate(cargoData.location.timestamp)}
                </div>
              </div>}
            {!cargoData.location.latitude && !locationError && !isLocating && <p className="text-xs text-gray-500 dark:text-gray-400">
                Add the current GPS location to your cargo data for better
                tracking.
              </p>}
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              Notes (Optional)
            </label>
            <textarea id="notes" value={cargoData.notes} onChange={e => updateField('notes', e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all min-h-[100px]" placeholder="Additional information about the cargo" />
          </div>
        </div>
        <div className="flex justify-between mt-8 mb-6">
          <button type="button" onClick={onBack} className="flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </button>
          <button type="submit" className="flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
            Next
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </form>
    </div>;
};
export default FormPage;