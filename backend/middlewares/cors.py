from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://147.182.142.200",
    "http://147.182.142.200:3000",
    "http://147.182.142.200:3001",
    "https://quivr.app",
    "https://www.quivr.app",
    "http://quivr.app",
    "http://www.quivr.app",
    "*",
]


def add_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
