from fastapi import FastAPI

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
import tempfile
import os
import logging
from typing import Dict
import torch
import torchaudio
import soundfile as sf
from transformers import AutoProcessor, SeamlessM4Tv2Model
import numpy as np
from scipy.io import wavfile
from datetime import datetime
import base64
import io
import shutil
import librosa
import time

import logging
import os
from typing import Optional
from io import BytesIO
import base64
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from PIL import Image
import time
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from guardrails import Guard
from .guardrails.toxic_language_detector.validator.main import ToxicLanguage

from .model_downloader import download_model

from .transcribe import transcribe_m4t, validate_audio
# Initialize logger with more detailed format
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI app configuration
app = FastAPI(
    title="Conversational AI API",
    description="A Multimodal Conversational AI API with Guardrails and Langchain",
    version="1.0.0",
    docs_url="/api/py/docs",
    openapi_url="/api/py/openapi.json"
)

# Create audio directory if not exists
AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'audio')
os.makedirs(AUDIO_DIR, exist_ok=True)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGINS", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ValidateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)

class ProcessOptions(BaseModel):
    temperature: Optional[float] = Field(default=0.7, ge=0, le=1)
    maxTokens: Optional[int] = Field(default=1000, ge=1, le=4096)
    image_data: Optional[str] = None
    audio_data: Optional[str] = None
    sourceLang: Optional[str] = None
    targetLang: Optional[str] = None

class ProcessRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=5000)
    options: Optional[ProcessOptions] = None

class ImageRequest(BaseModel):
    image_data: str = Field(..., description="Base64 encoded image data")

# Initialize Guard with toxic language detection
guard = Guard().use_many(
    ToxicLanguage(
    threshold=float(os.getenv("TOXIC_THRESHOLD", "0.5")),
    validation_method=os.getenv("VALIDATION_METHOD", "sentence"),
    on_fail="fix",
    device=os.getenv("DEVICE", "mps"),
    use_local=True),

    # DetectJailbreak(
    # threshold=float(os.getenv("JAILBREAK_THRESHOLD", "0.5")),
    # validation_method=os.getenv("VALIDATION_METHOD", "sentence"),
    # on_fail="fix",
    # device=os.getenv("DEVICE", "mps"),
    # use_local=True)
)

# Initialize LLM
llm = ChatOpenAI(
    base_url=os.getenv("LLM_BASE_URL", "http://127.0.0.1:11434/v1/"),
    api_key=os.getenv("LLM_API_KEY", "NA"),
    model=os.getenv("LLM_MODEL", "llama3.2-vision")
)

def validate_text(text: str) -> dict:
    validation_result = guard.validate(text)
    for summary in validation_result.validation_summaries:
        return {
            "validator_status": summary.validator_status,
            "reason": summary.error_spans[0].reason if summary.error_spans else None
        }
    return {"validator_status": "pass", "reason": None}

def process_image_prompt(image_data: str, prompt_text: str) -> str:
    logger.info(f"Processing image prompt: {prompt_text[:100]}...")

    try:
        # Decode and process image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))

        # Convert RGBA to RGB if needed
        if image.mode == 'RGBA':
            # Create white background
            background = Image.new('RGB', image.size, (255, 255, 255))
            # Paste using alpha channel as mask
            background.paste(image, mask=image.split()[3])
            image = background

        # Prepare image for LLM
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

        # Create message content
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_text},
                    {
                        "type": "image_url",
                        "image_url": f"data:image/jpeg;base64,{image_base64}"
                    }
                ]
            }
        ]

        # Process with LLM
        response = llm.invoke(messages)
        return response.content

    except Exception as e:
        logger.error(f"Image processing error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process image: {str(e)}"
        )

def process_text_prompt(prompt_text: str) -> dict:
    logger.info("Processing text prompt: %s", prompt_text)
    prompt = ChatPromptTemplate.from_messages([
        ("human", prompt_text)
    ])
    output_parser = StrOutputParser()
    chain = prompt | guard.to_runnable() | llm | output_parser
    logger.info("Running the chain... : %s", chain)
    response = chain.invoke({})
    return {"status": "success", "response": response}

@app.post("/api/py/validate")
async def validate(request: ValidateRequest):
    try:
        result = validate_text(request.text)
        print(result)
        return result
    except Exception as e:
        logger.error("Validation error: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/py/transcribe")
# async def transcribe(request: Request):
#     try:
#         # Read the raw body
#         body = await request.body()
        
#         # Find the audio data boundary
#         content = body.decode('latin1')
#         boundary = content.split('\r\n')[0]
        
#         # Split the content by boundary
#         parts = content.split(boundary)
        
#         # Find the part containing audio data
#         for part in parts:
#             if 'Content-Type: audio/' in part:
#                 # Extract the audio data
#                 audio_data = part.split('\r\n\r\n')[1].split('\r\n')[0]
#                 audio_bytes = audio_data.encode('latin1')
#                 break
#         else:
#             raise ValueError("No audio data found in request")
        
#         # Get target language from query parameters, default to None
#         target_lang = request.query_params.get("targetLang")
        
#         # Transcribe the audio
#         transcription = await transcribe_m4t(audio_data, target_lang)
        
#         # Return the transcription
#         return {"status": "success", "transcription": transcription}

#     except Exception as e:
#         logger.error(f"Transcription error: {str(e)}")
#         raise HTTPException(
#             status_code=500,
#             detail=f"Failed to transcribe audio: {str(e)}"
#         )
# @app.post("/api/py/transcribe")
async def transcribe_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm', 'audio/wav', 'audio/aac']
    if file.content_type not in ACCEPTED_AUDIO_TYPES:
        raise HTTPException(status_code=400, detail=f"Please upload a valid audio file ({', '.join(ACCEPTED_AUDIO_TYPES)})")


    try:
        file_path = os.path.join(AUDIO_DIR, f"audio_{int(time.time())}.wav")

        # Save uploaded file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Validate audio
        audio_data, sample_rate = await validate_audio(file_path)

        # Convert to required format
        sf.write(file_path, audio_data, sample_rate, subtype='PCM_16')
        logger.info(f"Audio validated and converted: {file_path}")

        # Process transcription
        output = transcribe_m4t(file_path)
        # print(output)
        logger.info(f"Transcription completed")

        # Cleanup file
        background_tasks.add_task(lambda: os.remove(file_path))

        # return {
        #     "status": "success",
        #     "transcription": output,
        #     "duration": float(librosa.get_duration(y=audio_data, sr=sample_rate))
        # }
        logger.info(f"Transcription result: {output}")
        

        return JSONResponse(content=output)

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/py/process")
async def process_request(prompt_request: ProcessRequest):
    logger.info(f"Processing request with prompt: {prompt_request.prompt[:100]}...")

    try:
        # Validate text input
        validation_result = validate_text(prompt_request.prompt)
        if validation_result["validator_status"] == "fail":
            return {
                "status": "fail",
                "response": validation_result["reason"]
            }

        # Process based on input type
        if prompt_request.options and prompt_request.options.image_data:
            response = process_image_prompt(
                prompt_request.options.image_data,
                prompt_request.prompt
            )
        else:
            # Text-only processing
            messages = [{"role": "user", "content": prompt_request.prompt}]
            response = llm.invoke(messages)
            response = response.content

        return {
            "status": "success",
            "response": response
        }

    except Exception as e:
        logger.error(f"Request processing error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process request: {str(e)}"
        )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception handler caught: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "error": "An unexpected error occurred. Please try again later."
        }
    )

@app.get("/")
def read_root():
    return {"message": "Welcome to the Toxic Language Detector API!"}

def setup():
    logger.info("Setting up the application... : Backend API")
    logger.info("Looking for Transformers model :  Seamless-M4T-V2-Large")
    SEAMLESS_MODEL_PATH="~/.cache/huggingface/hub/facebook/seamless-m4t-v2-large"
    if not os.path.exists(SEAMLESS_MODEL_PATH):
        logger.info("Downloading Seamless-M4T-V2-Large model...")
        download_model(SEAMLESS_MODEL_PATH)
