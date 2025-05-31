from fastapi import FastAPI
from langchain.prompts import ChatPromptTemplate
from langserve import add_routes
import uvicorn
import os
from langchain_community.llms import Ollama
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Langchain Server",
    version="1.0",
    description="Chat API server for Langchain"
)

# Initialize Ollama with the Llama2 model
llm = Ollama(model="llama3.1")

# Define the chat prompt template
prompt = ChatPromptTemplate.from_template("You are a helpful assistant. Please respond to the user prompt: {prompt}")

# Add routes to expose the Llama API
add_routes(
    app,
    prompt | llm,
    path="/llama_api"
)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=5017)
