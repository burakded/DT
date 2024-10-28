import os
if __name__ == "__main__":
    # import needed here when running main.py to debug backend
    # you will need to run pip install python-dotenv
    from dotenv import load_dotenv
    load_dotenv()
import pypandoc
import sentry_sdk
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from logger import get_logger
from middlewares.cors import add_cors_middleware
from routes.api_key_routes import api_key_router
from routes.brain_routes import brain_router
from routes.chat_routes import chat_router
from routes.crawl_routes import crawl_router
from routes.explore_routes import explore_router
from routes.misc_routes import misc_router
from routes.prompt_routes import prompt_router
from routes.subscription_routes import subscription_router
from routes.upload_routes import upload_router
from routes.user_routes import user_router
from routes.elevenlabs_routes import elevenlabs_router
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware

logger = get_logger(__name__)

sentry_dsn = os.getenv("SENTRY_DSN")
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        traces_sample_rate=1.0,
    )

app = FastAPI()


origins = [
    os.getenv("FRONTEND_URL")
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow the specified origins
    allow_credentials=True,   # Allow credentials (like cookies) to be sent
    allow_methods=["*"],      # Allow all HTTP methods
    allow_headers=["*"],      # Allow all headers
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
add_cors_middleware(app)

def sync_brain_to_elevenlabs():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        brain_ids_response = supabase.table("brains").select("brain_id").execute()
        brain_ids = [row["brain_id"] for row in brain_ids_response.data]

        elevenlabs_ids_response = supabase.table("elevenlabs").select("brain_id").execute()
        elevenlabs_ids = [row["brain_id"] for row in elevenlabs_ids_response.data]

        missing_ids = set(brain_ids) - set(elevenlabs_ids)
        if missing_ids:
            print(f"The following Elevenlabs IDs are missing: {', '.join(map(str, missing_ids))}")
        else:
            print("The Elevenlabs database is already up to date.")
            return

        for id in missing_ids:
            supabase.table("elevenlabs").insert({"brain_id": id, "name": "Burak", "voice_id": "OgdkMvO79FR6nRGBcFek"}).execute()
        print("Elevenlabs scripts have been successfully executed.")

    except Exception as e:
        print(e)

@app.on_event("startup")
async def startup_event():
    if not os.path.exists(pypandoc.get_pandoc_path()):
        pypandoc.download_pandoc()
    sync_brain_to_elevenlabs()


app.include_router(brain_router)
app.include_router(chat_router)
app.include_router(crawl_router)
app.include_router(explore_router)
app.include_router(misc_router)
app.include_router(upload_router)
app.include_router(user_router)
app.include_router(api_key_router)
app.include_router(subscription_router)
app.include_router(prompt_router)
app.include_router(elevenlabs_router, prefix="/api", tags=["ElevenLabs"])



@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


# log more details about validation errors (422)
def handle_request_validation_error(app: FastAPI):
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ):
        exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
        logger.error(request, exc_str)
        content = {
            "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
            "message": exc_str,
            "data": None,
        }
        return JSONResponse(
            content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )


handle_request_validation_error(app)

if __name__ == "__main__":
    # run main.py to debug backend
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5050)

