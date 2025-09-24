from fastapi import APIRouter, HTTPException
from app.schemas import GenerateRequest, GenerateResponse
from app.llm import get_llm, get_all_models


router = APIRouter()

@router.get("/models")
def list_models():
    return {"models": get_all_models()}

@router.post("/generate", response_model=GenerateResponse)
def generate(request: GenerateRequest):
    try:
        llm = get_llm(request.model)
        result = llm(request.prompt)
        return GenerateResponse(result=result, model=request.model)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
