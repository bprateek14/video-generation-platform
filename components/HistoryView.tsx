
import React from 'react';
import type { Message } from '../types';
import { MessageAuthor } from '../types';

interface HistoryViewProps {
  history: Message[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const generatedContent = history.filter(
    (msg) => msg.author === MessageAuthor.BOT && (msg.imageUrl || msg.videoUrl)
  );

  const findPromptForBotMessage = (botMessageId: string): string => {
    const botMessageIndex = history.findIndex(msg => msg.id === botMessageId);
    if (botMessageIndex > 0) {
        const userMessage = history[botMessageIndex - 1];
        if (userMessage && userMessage.author === MessageAuthor.USER) {
            return userMessage.text;
        }
    }
    return "Prompt not found";
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Generation History</h2>
      {generatedContent.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
            <p className="text-text-secondary">No generations yet. Go to the Chat tab to create some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {generatedContent.map((item) => (
            <div key={item.id} className="bg-secondary rounded-lg overflow-hidden border border-primary/20">
              <div className="aspect-square bg-base flex items-center justify-center">
                 {item.imageUrl && <img src={item.imageUrl} alt="Generated content" className="w-full h-full object-cover" />}
                 {item.videoUrl && <video src={item.videoUrl} controls className="w-full h-full object-cover" />}
              </div>
              <div className="p-3">
                <p className="text-sm text-text-secondary truncate" title={findPromptForBotMessage(item.id)}>
                    {`> `}{findPromptForBotMessage(item.id)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
