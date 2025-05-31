from fastapi import FastAPI
import json
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from router import pension, mnrega

# Configure CORS
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
origins = ["*"]
app=FastAPI(
    title="Pensioner Grievance Assistant"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Add the session middleware to the app
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# Import the pension router
app.include_router(pension.router)
app.include_router(mnrega.router)
