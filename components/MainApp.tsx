import React, { useState, useCallback, SetStateAction } from 'react';
import { GenerateIcon, HistoryIcon, SettingsIcon, DashboardIcon, SignOutIcon } from './icons';
import ChatView from './ChatView';
import HistoryView from './HistoryView';
import SettingsView from './SettingsView';
import DashboardView from './DashboardView';
import { Message, Settings, ModelProvider } from '../types';

type Tab = 'dashboard' | 'generate' | 'history' | 'settings';

// Fix: Updated the return type and setValue parameter to use SetStateAction
// to allow passing state updater functions.
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: SetStateAction<T>) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: SetStateAction<T>) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

interface MainAppProps {
    onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [history, setHistory] = useLocalStorage<Message[]>('genforge-history', []);
    const [settings, setSettings] = useLocalStorage<Settings>('genforge-settings', {
        provider: ModelProvider.GOOGLE,
        apiKey: '',
        imageModel: 'imagen-4.0-generate-001',
        videoModel: 'veo-3.1-fast-generate-preview',
        customEndpoint: '',
    });
    
    const setHistoryCallback = useCallback((newHistory: Message[] | ((h: Message[]) => Message[])) => {
        setHistory(newHistory);
    }, [setHistory]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView settings={settings} history={history} />;
            case 'generate':
                return <ChatView history={history} setHistory={setHistoryCallback} settings={settings} />;
            case 'history':
                return <HistoryView history={history} />;
            case 'settings':
                return <SettingsView settings={settings} setSettings={setSettings} />;
            default:
                return null;
        }
    };

    const NavItem: React.FC<{ tabName: Tab; icon: React.ReactNode; label: string }> = ({ tabName, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex flex-col items-center justify-center p-3 w-full transition-colors duration-200 ${
                activeTab === tabName ? 'bg-primary text-black' : 'text-text-secondary hover:bg-secondary hover:text-primary'
            }`}
        >
            {icon}
            <span className="text-xs mt-1">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-base text-text-primary">
            <nav className="flex flex-col w-20 bg-secondary border-r border-primary/20">
                <div className="flex flex-col items-center p-2 border-b border-primary/20">
                    <div className="w-10 h-10 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center text-primary font-bold">
                        G
                    </div>
                </div>
                <div className="flex-1">
                    <NavItem tabName="dashboard" icon={<DashboardIcon />} label="Dashboard" />
                    <NavItem tabName="generate" icon={<GenerateIcon />} label="Generate" />
                    <NavItem tabName="history" icon={<HistoryIcon />} label="History" />
                    <NavItem tabName="settings" icon={<SettingsIcon />} label="Settings" />
                </div>
                <div className="border-t border-primary/20">
                     <button
                        onClick={onLogout}
                        className="flex flex-col items-center justify-center p-3 w-full text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
                        aria-label="Sign Out"
                    >
                        <SignOutIcon />
                        <span className="text-xs mt-1">Sign Out</span>
                    </button>
                </div>
            </nav>
            <main className="flex-1 flex flex-col overflow-hidden">
                {renderTabContent()}
            </main>
        </div>
    );
};

export default MainApp;