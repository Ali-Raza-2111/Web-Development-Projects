from fastapi import APIRouter, HTTPException
from fastapi.`responses` import StreamingResponse
from schemas.description import GenerateRequest, GenerateResponse, RefineRequest, RefineResponse
from services.text_generator import text_generator

router = APIRouter()

@router.post("/generate")
async def generate_linkedin_description(request: GenerateRequest):
    try:
        return StreamingResponse(
            text_generator.generate_description_stream(request),
            media_type="text/plain"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refine", response_model=RefineResponse)
async def refine_linkedin_description(request: RefineRequest):
    try:
        result = text_generator.refine_description(request)
        return RefineResponse(refined_text=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
