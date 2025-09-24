from pydantic import BaseModel

class GenerateRequest(BaseModel):
    prompt: str
    model: str

class GenerateResponse(BaseModel):
    result: str
    model: str
