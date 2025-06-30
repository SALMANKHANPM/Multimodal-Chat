import { ProcessOptions } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://w7kcdj7s-8001.inc1.devtunnels.ms:8001/";

// Check if API is available
async function checkApiAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function validateText(
  text: string
): Promise<{ validator_status: string; reason: string | null }> {
  try {
    const isApiAvailable = await checkApiAvailability();
    if (!isApiAvailable) {
      throw new Error(
        "API server is not available. Please ensure the backend service is running."
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/py/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error("Validation request failed");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TimeoutError") {
        throw new Error(
          "Request timed out. Please check your connection and try again."
        );
      }
      if (
        error.message.includes("fetch failed") ||
        error.message.includes("SocketError")
      ) {
        throw new Error(
          "Unable to connect to the API server. Please ensure the backend service is running on " +
            API_BASE_URL
        );
      }
    }
    throw error;
  }
}

export async function processPrompt(
  prompt: string,
  options?: ProcessOptions
): Promise<{
  status: string;
  response: { tel: string | null; eng: string | null; generation: string };
}> {
  try {
    const isApiAvailable = await checkApiAvailability();
    if (!isApiAvailable) {
      throw new Error(
        "API server is not available. Please ensure the backend service is running on " +
          API_BASE_URL
      );
    }

    let transcriptionData = { transcription: null, translation: null };

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
        const audioBlob = new Blob([byteArray], { type: "audio/webm" });

        // Create form data for transcription
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.wav");

        // Send transcription request
        const transcriptionResponse = await fetch(
          `${API_BASE_URL}/api/py/transcribe`,
          {
            method: "POST",
            body: formData,
            signal: AbortSignal.timeout(30000), // 30 second timeout for audio processing
          }
        );

        if (!transcriptionResponse.ok) {
          const error = await transcriptionResponse.json();
          throw new Error(error.detail || "Transcription failed");
        }

        transcriptionData = await transcriptionResponse.json();

        // Append transcription to prompt for LLM processing
        prompt = `${prompt}\n\nTranscribed Audio: ${transcriptionData.transcription}\nTranslation: ${transcriptionData.translation}`;
      } catch (error) {
        console.error("Transcription error:", error);
        if (error instanceof Error) {
          if (error.name === "TimeoutError") {
            throw new Error(
              "Audio processing timed out. Please try with a shorter audio file."
            );
          }
          if (
            error.message.includes("fetch failed") ||
            error.message.includes("SocketError")
          ) {
            throw new Error(
              "Unable to connect to the transcription service. Please ensure the backend service is running."
            );
          }
        }
        throw new Error("Failed to process audio input");
      }
    }

    // Send the final request with all modalities and options
    const response = await fetch(`${API_BASE_URL}/api/py/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        options: {
          temperature: options?.temperature,
          maxTokens: options?.maxTokens,
          image_data: options?.image_data,
          sourceLang: options?.sourceLang,
          targetLang: options?.targetLang,
          // Remove audio_data as it's been processed
          audio_data: undefined,
        },
      }),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Processing request failed");
    }

    const result = await response.json();

    // Return structured response with transcription, translation, and LLM output
    return {
      status: "success",
      response: {
        tel: transcriptionData.transcription || null,
        eng: transcriptionData.translation || null,
        generation: result.response,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TimeoutError") {
        throw new Error("Request timed out. Please try again.");
      }
      if (
        error.message.includes("fetch failed") ||
        error.message.includes("SocketError")
      ) {
        throw new Error(
          "Unable to connect to the API server. Please ensure the backend service is running on " +
            API_BASE_URL
        );
      }
    }
    throw error;
  }
}
