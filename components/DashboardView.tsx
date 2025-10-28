import React, { useMemo } from 'react';
import { Settings, Message, MessageAuthor } from '../types';
import { ImageGenerationIcon, VideoGenerationIcon } from './icons';

interface DashboardViewProps {
  settings: Settings;
  history: Message[];
}

const StatCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-secondary border border-primary/20 rounded-lg p-6 ${className}`}>
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">{title}</h3>
        {children}
    </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ settings, history }) => {

    const usageStats = useMemo(() => {
        const MOCK_IMAGE_COST = 0.04;
        const MOCK_VIDEO_COST = 0.20;

        const imageGenerations = history.filter(msg => msg.author === MessageAuthor.BOT && msg.imageUrl).length;
        const videoGenerations = history.filter(msg => msg.author === MessageAuthor.BOT && msg.videoUrl).length;

        const totalCost = (imageGenerations * MOCK_IMAGE_COST) + (videoGenerations * MOCK_VIDEO_COST);

        return {
            imageGenerations,
            videoGenerations,
            totalCost: totalCost.toFixed(2),
        };
    }, [history]);

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-6 border-b border-primary/20 pb-2">System Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="API Usage (Simulated)">
                   <div className="text-5xl font-mono font-bold text-primary">
                     ${usageStats.totalCost}
                   </div>
                   <p className="text-xs text-text-secondary mt-2">
                     Based on {usageStats.imageGenerations} images and {usageStats.videoGenerations} videos.
                   </p>
                </StatCard>

                <div className="md:col-span-2">
                     <StatCard title="Active Configuration">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-text-secondary">Provider</p>
                                <p className="text-lg text-text-primary font-semibold">{settings.provider}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-text-secondary flex items-center"><ImageGenerationIcon className="w-4 h-4 mr-1"/>Image Model</p>
                                    <p className="text-md text-text-primary truncate" title={settings.imageModel}>{settings.imageModel}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-secondary flex items-center"><VideoGenerationIcon className="w-4 h-4 mr-1"/>Video Model</p>
                                    <p className="text-md text-text-primary truncate" title={settings.videoModel}>{settings.videoModel}</p>
                                </div>
                            </div>
                        </div>
                     </StatCard>
                </div>
            </div>

            <div className="mt-8">
               <StatCard title="Activity Log">
                  <div className="text-center text-text-secondary py-8">
                    <p>// Feature coming soon: Real-time generation logs</p>
                  </div>
               </StatCard>
            </div>

        </div>
    );
};

export default DashboardView;
