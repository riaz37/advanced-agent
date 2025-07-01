from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, AsyncGenerator
import os
import json
import asyncio
from dotenv import load_dotenv

# Import your existing workflow
from src.workflow import Workflow
from src.models import ResearchState

load_dotenv()

app = FastAPI(
    title="Developer Tools Research API",
    description="API for researching and analyzing developer tools",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://*.vercel.app",  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    query: str

class ResearchResponse(BaseModel):
    query: str
    extracted_tools: list[str]
    companies: list[dict]
    analysis: str
    status: str = "success"

class ProgressUpdate(BaseModel):
    step: str
    progress: int  # 0-100
    message: str
    data: Optional[dict] = None

@app.get("/")
async def root():
    return {"message": "Developer Tools Research API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

async def research_with_progress(query: str) -> AsyncGenerator[str, None]:
    """Research with real-time progress updates"""
    try:
        # Step 1: Initialize
        yield f"data: {json.dumps({'step': 'initialize', 'progress': 10, 'message': '🔍 Initializing research workflow...'})}\n\n"
        await asyncio.sleep(0.5)

        # Step 2: Extract tools
        yield f"data: {json.dumps({'step': 'extract', 'progress': 25, 'message': '🎯 Extracting tool names from query...'})}\n\n"
        workflow = Workflow()
        await asyncio.sleep(1)

        # Step 3: Web research
        yield f"data: {json.dumps({'step': 'research', 'progress': 50, 'message': '🌐 Researching tools on the web...'})}\n\n"
        await asyncio.sleep(2)

        # Step 4: AI Analysis
        yield f"data: {json.dumps({'step': 'analyze', 'progress': 75, 'message': '🤖 AI is analyzing the data...'})}\n\n"

        # Run the actual workflow
        result: ResearchState = workflow.run(query.strip())
        await asyncio.sleep(1)

        # Step 5: Complete
        yield f"data: {json.dumps({'step': 'complete', 'progress': 100, 'message': '✨ Research complete!'})}\n\n"

        # Send final result
        final_result = {
            "step": "result",
            "progress": 100,
            "message": "Research completed successfully",
            "data": {
                "query": result.query,
                "extracted_tools": result.extracted_tools,
                "companies": [company.dict() for company in result.companies],
                "analysis": result.analysis,
                "status": "completed"
            }
        }
        yield f"data: {json.dumps(final_result)}\n\n"

    except Exception as e:
        error_result = {
            "step": "error",
            "progress": 0,
            "message": f"Research failed: {str(e)}",
            "data": {"error": str(e)}
        }
        yield f"data: {json.dumps(error_result)}\n\n"

@app.post("/research/stream")
async def research_stream(request: ResearchRequest):
    """Stream research progress in real-time"""
    if not request.query or len(request.query.strip()) < 3:
        raise HTTPException(status_code=400, detail="Query must be at least 3 characters long")

    return StreamingResponse(
        research_with_progress(request.query),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
        }
    )

@app.post("/research", response_model=ResearchResponse)
async def research_tools(request: ResearchRequest):
    """
    Research developer tools based on the provided query
    """
    try:
        # Validate input
        if not request.query or len(request.query.strip()) < 3:
            raise HTTPException(status_code=400, detail="Query must be at least 3 characters long")

        # Initialize and run workflow
        workflow = Workflow()
        result: ResearchState = workflow.run(request.query.strip())

        # Convert companies to dict format for JSON serialization
        companies_dict = []
        for company in result.companies:
            companies_dict.append({
                "name": company.name,
                "website": company.website,
                "description": company.description,
                "pricing_model": company.pricing_model,
                "is_open_source": company.is_open_source,
                "api_available": company.api_available,
                "tech_stack": company.tech_stack,
                "language_support": company.language_support,
                "integration_capabilities": company.integration_capabilities,
                "developer_experience_rating": company.developer_experience_rating,
                "competitors": company.competitors
            })

        return ResearchResponse(
            query=result.query,
            extracted_tools=result.extracted_tools,
            companies=companies_dict,
            analysis=result.analysis
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Research failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
