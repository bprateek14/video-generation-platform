
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message, Settings } from '../types';
import { GenerationType, MessageAuthor } from '../types';
import { generateImage, generateVideo } from '../services/geminiService';
import { SendIcon, ImageGenerationIcon, VideoGenerationIcon } from './icons';

interface ChatViewProps {
  history: Message[];
  setHistory: (updater: (h: Message[]) => Message[]) => void;
  settings: Settings;
}

const ChatView: React.FC<ChatViewProps> = ({ history, setHistory, settings }) => {
  const [prompt, setPrompt] = useState('');
  const [generationType, setGenerationType] = useState<GenerationType>(GenerationType.IMAGE);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleGeneration = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      author: MessageAuthor.USER,
      text: prompt,
    };
    const botMessageId = `bot-${Date.now()}`;
    const botLoadingMessage: Message = {
      id: botMessageId,
      author: MessageAuthor.BOT,
      text: `Generating ${generationType}...`,
      isLoading: true,
    };

    setHistory(prev => [...prev, userMessage, botLoadingMessage]);
    setPrompt('');

    try {
      if (generationType === GenerationType.IMAGE) {
        const imageUrl = await generateImage(prompt, settings);
        setHistory(prev => prev.map(msg => 
            msg.id === botMessageId 
            ? { ...msg, text: "Here is your generated image:", imageUrl, isLoading: false } 
            : msg
        ));
      } else {
        const onProgress = (status: string) => {
            setHistory(prev => prev.map(msg => 
                msg.id === botMessageId ? { ...msg, text: status } : msg
            ));
        };
        const videoUrl = await generateVideo(prompt, settings, onProgress);
        setHistory(prev => prev.map(msg => 
            msg.id === botMessageId 
            ? { ...msg, text: "Your generated video is ready:", videoUrl, isLoading: false } 
            : msg
        ));
      }
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setHistory(prev => prev.map(msg => 
          msg.id === botMessageId 
          ? { ...msg, text: `Error: ${errorMessage}`, isLoading: false, isError: true } 
          : msg
      ));
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, isGenerating, generationType, setHistory, settings]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGeneration();
    }
  };

  return (
    <div className="flex flex-col h-full bg-base p-4">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {history.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.author === MessageAuthor.USER ? 'justify-end' : ''}`}>
            {msg.author === MessageAuthor.BOT && <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex-shrink-0 mt-1"></div>}
            <div className={`max-w-lg p-3 rounded-lg ${msg.author === MessageAuthor.USER ? 'bg-primary text-black' : 'bg-secondary'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.isLoading && <div className="w-4 h-4 border-2 border-dashed border-primary rounded-full animate-spin mt-2"></div>}
              {msg.imageUrl && <img src={msg.imageUrl} alt="Generated" className="mt-2 rounded-lg max-w-sm" />}
              {msg.videoUrl && <video src={msg.videoUrl} controls className="mt-2 rounded-lg max-w-sm" />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 border-t border-primary/20 pt-4">
        <div className="relative bg-secondary rounded-lg border border-primary/30 focus-within:border-primary transition-colors">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Enter a prompt for ${generationType} generation...`}
            className="w-full bg-transparent p-3 pr-28 resize-none focus:outline-none text-text-primary"
            rows={2}
            disabled={isGenerating}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <div className="flex items-center bg-base rounded-md border border-primary/30">
              <button
                onClick={() => setGenerationType(GenerationType.IMAGE)}
                className={`p-2 rounded-l-md transition-colors ${generationType === GenerationType.IMAGE ? 'bg-primary text-black' : 'text-text-secondary hover:bg-primary/20'}`}
              >
                <ImageGenerationIcon />
              </button>
              <button
                onClick={() => setGenerationType(GenerationType.VIDEO)}
                className={`p-2 rounded-r-md transition-colors ${generationType === GenerationType.VIDEO ? 'bg-primary text-black' : 'text-text-secondary hover:bg-primary/20'}`}
              >
                <VideoGenerationIcon />
              </button>
            </div>
            <button
              onClick={handleGeneration}
              disabled={isGenerating || !prompt.trim()}
              className="p-2 bg-primary text-black rounded-md hover:bg-accent disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
