from fastapi import APIRouter, HTTPException, Response, Request
from pydantic import BaseModel
import requests
from logger import get_logger
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv
import os
from supabase import create_client, Client
load_dotenv()

# Set up logger
logger = get_logger(__name__)

# Get global constants
elevenlabs_key = os.environ.get("ELEVENLABS_KEY")

chunk_size = int(os.environ.get("CHUNK_SIZE"))

# ElevenLabs client
client = ElevenLabs(
    api_key=elevenlabs_key
)

# FastAPI router
elevenlabs_router = APIRouter()

# Define request body models
class TextToSpeechRequest(BaseModel):
    brainName: str
    text: str

@elevenlabs_router.post("/elevenlabs/text-to-speech", response_class=Response)
async def text_to_speech(request: TextToSpeechRequest):
    try:
        SUPABASE_URL = os.getenv("SUPABASE_URL")
        SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        response = supabase.table("brains").select("brain_id").eq("name", request.brainName).execute()
        brain_id=""
        if response.data and len(response.data) > 0:
            brain_id = response.data[0]['brain_id']
        response = supabase.table("elevenlabs").select("voice_id").eq("brain_id", brain_id).execute()
        voiceId=""
        if response.data and len(response.data) > 0:
            voiceId = response.data[0]['voice_id']
        """
        Convert text to speech using Eleven Labs API.
        """
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voiceId}"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": elevenlabs_key
        }
        payload = {
            "text": request.text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Error calling Eleven Labs API: {e}")
        raise HTTPException(status_code=500, detail="Failed to convert text to speech")

    return Response(content=response.content, media_type="audio/mpeg")

@elevenlabs_router.get("/elevenlabs/voices")
async def get_all_elevenlabs_voices():
    """
    Retrieve all Eleven Labs voices.
    """
    try:
        response = client.voices.get_all()
        data = [
            {"name": v.name, "voice_id": v.voice_id}
            for voice in response
            for v in voice[1]
            if v.category == "cloned"
        ]
    except Exception as e:
        logger.error(f"Error fetching voices from Eleven Labs: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve voices")

    return {"voices": data}



SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

@elevenlabs_router.post("/elevenlabs/brain", response_class=Response)
async def postElevenLabs(request: Request):
    try:
        body = await request.json()
        brain_id = body.get("brain_id")
        name = body.get("name")
        voice_id = body.get("voice_id")
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        response = supabase.table("elevenlabs").insert({
            "brain_id": brain_id,
            "name": name,
            "voice_id": voice_id
        }).execute()
        if response.status_code == 201: 
            return Response(content="Record inserted successfully", status_code=201)
        else:
            raise HTTPException(status_code=response.status_code, detail=response.data)


    except Exception as e:
        print(e)



@elevenlabs_router.get("/elevenlabs/brain/{brain_id}", response_class=Response)
async def getElevenLabsBrain(brain_id: str):
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        
        response = supabase.table("elevenlabs").select("*").eq("brain_id", brain_id).execute()

        if response.data:
            return Response(content=response.json(), status_code=200)
        else:
            raise HTTPException(status_code=404, detail="Brain not found")

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while fetching the brain data")