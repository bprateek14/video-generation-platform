import React, { useState } from 'react';
import { Settings, ModelProvider } from '../types';
import { ChevronDownIcon, EyeIcon, EyeSlashIcon } from './icons';

interface SettingsViewProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-text-secondary mb-1">
            {label}
        </label>
        <input
            {...props}
            className="w-full px-3 py-2 bg-secondary border border-primary/30 rounded-md text-text-primary focus:outline-none focus:ring-primary focus:border-primary transition-colors"
        />
    </div>
);

const SettingsSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-text-secondary mb-1">
            {label}
        </label>
        <select
            {...props}
            className="w-full px-3 py-2 bg-secondary border border-primary/30 rounded-md text-text-primary focus:outline-none focus:ring-primary focus:border-primary transition-colors appearance-none"
        >
            {children}
        </select>
    </div>
);

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border border-primary/20 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-secondary/50 rounded-t-lg"
            >
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                <ChevronDownIcon className={`w-5 h-5 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
};


const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSettings(localSettings);
    alert('Settings saved!');
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
    } else {
        alert("API Key selection dialog is not available.");
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b border-primary/20 pb-2">
        <h2 className="text-2xl font-bold text-primary">Settings</h2>
        <div className="flex items-center space-x-2 text-sm">
            <span className="text-text-secondary">Active Provider:</span>
            <span className="font-bold text-primary px-2 py-1 bg-secondary rounded-md">{settings.provider}</span>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <CollapsibleSection title="Model Configuration">
            <SettingsSelect
                label="Model Provider"
                name="provider"
                value={localSettings.provider}
                onChange={handleInputChange}
            >
                {Object.values(ModelProvider).map(p => <option key={p} value={p}>{p}</option>)}
            </SettingsSelect>
            
            <div className="relative">
                <SettingsInput
                    label="API Key"
                    name="apiKey"
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={localSettings.apiKey}
                    onChange={handleInputChange}
                    placeholder="Enter your API key"
                />
                <button 
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-[33px] text-text-secondary hover:text-primary"
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                    {showApiKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            </div>
             <p className="text-xs text-text-secondary mt-1">
                Note: API Keys are stored in your browser's local storage. Do not use this on a shared computer.
            </p>
        </CollapsibleSection>

        <CollapsibleSection title="Cloud Settings & Endpoints">
            <SettingsInput
                label="Image Model Name"
                name="imageModel"
                id="imageModel"
                value={localSettings.imageModel}
                onChange={handleInputChange}
                />
            <SettingsInput
                label="Video Model Name"
                name="videoModel"
                id="videoModel"
                value={localSettings.videoModel}
                onChange={handleInputChange}
                />
            {localSettings.provider === ModelProvider.CUSTOM && (
                 <SettingsInput
                    label="Custom Endpoint URL"
                    name="customEndpoint"
                    id="customEndpoint"
                    value={localSettings.customEndpoint}
                    onChange={handleInputChange}
                    placeholder="https://api.example.com/v1"
                />
            )}
            
            {localSettings.provider === ModelProvider.GOOGLE && (
                <div className="pt-4 border-t border-primary/20">
                     <p className="text-sm text-text-secondary mb-2">
                        For Google Veo video generation, you must select an API key via the platform's dialog.
                        Read more about billing <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">here</a>.
                    </p>
                    <button
                        onClick={handleOpenKeySelector}
                        className="px-4 py-2 border border-primary text-primary text-sm rounded-md hover:bg-primary hover:text-black transition-colors"
                    >
                        Select Google Video API Key
                    </button>
                </div>
            )}
        </CollapsibleSection>

        <div>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-black font-bold rounded-md hover:bg-accent transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;