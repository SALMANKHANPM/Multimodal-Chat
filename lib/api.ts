import { ProcessOptions } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function validateText(text: string): Promise<{ validator_status: string; reason: string | null }> {
  const response = await fetch(`${API_BASE_URL}/api/py/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Validation request failed');
  }

  return response.json();
}

export async function processPrompt(prompt: string, options?: ProcessOptions): Promise<{ status: string; response: string }> {
  // If there's audio data, transcribe it first
  if (options?.audio_data) {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(options.audio_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: 'audio/webm' });

      // Create form data for transcription
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      // Send transcription request
      const transcriptionResponse = await fetch(`${API_BASE_URL}/api/py/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        const error = await transcriptionResponse.json();
        throw new Error(error.detail || 'Transcription failed');
      }

      const transcriptionResult = await transcriptionResponse.json();
      
      // Append transcription to prompt
      prompt = `${prompt}\n\nTranscribed Audio: ${transcriptionResult.transcription}\nTranslation: ${transcriptionResult.translation}`;
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to process audio input');
    }
  }

  // Send the final request with all modalities
  const response = await fetch(`${API_BASE_URL}/api/py/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      prompt,
      options: {
        ...options,
        // Remove audio_data as it's been processed
        audio_data: undefined
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Processing request failed');
  }

  return response.json();
}