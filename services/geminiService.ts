
import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

let hasApiKeyBeenSelected = false;

const ensureApiKey = async (): Promise<boolean> => {
    if (hasApiKeyBeenSelected) return true;
    try {
        if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
            hasApiKeyBeenSelected = true;
            return true;
        }
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Assume success after opening dialog to avoid race condition
            hasApiKeyBeenSelected = true;
            return true;
        }
        return false;
    } catch (error) {
        console.error("API Key selection error:", error);
        return false;
    }
};

const getFreshAiClient = () => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        // In a real app, you might throw or handle this more gracefully.
        // For Veo, the key comes from the selection dialog.
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateImage = async (prompt: string, settings: Settings): Promise<string> => {
    const ai = getFreshAiClient();
    const response = await ai.models.generateImages({
        model: settings.imageModel,
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    const base64ImageBytes = response.generatedImages[0]?.image.imageBytes;
    if (!base64ImageBytes) {
        throw new Error("No image data received from API.");
    }
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const generateVideo = async (
    prompt: string,
    settings: Settings,
    onProgress: (status: string) => void
): Promise<string> => {
    const hasKey = await ensureApiKey();
    if (!hasKey) {
        throw new Error("API Key required for video generation. Please select a key in the settings.");
    }
    
    const ai = getFreshAiClient();

    onProgress("Initializing video generation...");
    let operation;
    try {
         operation = await ai.models.generateVideos({
            model: settings.videoModel,
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9',
            }
        });
    } catch (e: any) {
        if (e.message?.includes("Requested entity was not found")) {
            hasApiKeyBeenSelected = false; // Reset state
            throw new Error("API Key is invalid. Please select a valid key. You can open the key selector from the settings tab.");
        }
        throw e;
    }
    
    onProgress("Generation in progress... This may take a few minutes.");

    let pollCount = 0;
    while (!operation.done) {
        pollCount++;
        onProgress(`Processing... [Polling ${pollCount}] This may take a few minutes.`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        try {
            operation = await ai.operations.getVideosOperation({ operation: operation });
        } catch(e: any) {
            if (e.message?.includes("Requested entity was not found")) {
                hasApiKeyBeenSelected = false; // Reset state
                throw new Error("API Key is invalid. Please select a valid key. You can open the key selector from the settings tab.");
            }
             throw e;
        }
    }

    onProgress("Finalizing video...");

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was provided.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video file: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};
