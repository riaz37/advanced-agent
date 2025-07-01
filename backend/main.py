from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
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
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
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

@app.get("/")
async def root():
    return {"message": "Developer Tools Research API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

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
