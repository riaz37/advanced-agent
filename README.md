# Advanced Agent: Developer Tools Research Agent

## Overview
Advanced Agent is an AI-powered research assistant that helps you discover, compare, and analyze developer tools. Leveraging LLMs (Gemini), web scraping, and structured workflows, it provides actionable insights and recommendations for any developer tool query.

## Features
- 🔍 **Automated Research**: Finds and analyzes articles and official sources for your query.
- 🛠️ **Tool Extraction**: Identifies relevant tools and competitors from web content.
- 🏢 **Company Analysis**: Scrapes and summarizes company websites, extracting pricing, tech stack, open source status, API availability, and more.
- 🤖 **LLM-Powered Recommendations**: Uses Gemini LLM to generate structured analysis and recommendations.
- ⚡ **Real-time Progress**: Live streaming progress updates during research workflow.
- 🎨 **Modern React UI**: Beautiful, responsive interface with Tailwind CSS and glassmorphism design.
- 🚀 **Production Ready**: Dockerized application ready for deployment.

## Architecture
- **Frontend**: React with TypeScript, Vite, and Tailwind CSS
- **Backend**: FastAPI with Python 3.12+
- **AI/LLM**: Google Gemini 2.0 Flash
- **Web Scraping**: Firecrawl API
- **Deployment**: Docker containers, Vercel (frontend), Render (backend)

## How It Works
1. **User Query**: Enter a research query (e.g., "API monitoring tools") in the React UI.
2. **Real-time Streaming**: The backend streams progress updates via Server-Sent Events.
3. **Workflow**: The backend workflow (in `src/workflow.py`) runs three main steps:
   - **Extract Tools** (25%): Finds tool names from web search results and articles.
   - **Research Companies** (50%): Scrapes official sites and analyzes content.
   - **Generate Analysis** (75%): Uses Gemini LLM for structured recommendations.
4. **Results**: The UI displays extracted tools, detailed company info, and AI-generated insights.

## Setup Instructions

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.12+ (for backend)
- **Docker** (optional, for containerized deployment)

### Local Development

#### Backend Setup
1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (Gemini, Firecrawl, etc.)
   ```

4. **Start the backend server:**
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup
1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)

### Docker Deployment

#### Build and Run with Docker Compose
```bash
# Build and start both services
docker-compose up --build

# Or build individually
docker build -t riaz37/advanced-agent-backend ./backend
docker build -t riaz37/advanced-agent-frontend ./frontend
```

#### Push to Docker Hub
```bash
# Tag and push images
docker tag advanced-agent-backend riaz37/advanced-agent-backend:latest
docker tag advanced-agent-frontend riaz37/advanced-agent-frontend:latest

docker push riaz37/advanced-agent-backend:latest
docker push riaz37/advanced-agent-frontend:latest
```

## Usage
1. Enter a research query (e.g., "API monitoring tools").
2. Watch real-time progress updates as the AI researches.
3. View extracted tools, company details, and AI-generated recommendations.

## Example Query
- **Input:** `API monitoring tools`
- **Output:**
  - List of relevant tools (e.g., Postman, Datadog, New Relic, etc.)
  - Company info: website, description, pricing, tech stack, open source status, API, language support, integrations, competitors
  - AI-generated summary and recommendations

## Deployment

### Production Deployment
- **Frontend**: Deploy to Vercel, Netlify, or similar
- **Backend**: Deploy to Render, Railway, or similar
- **Environment Variables**: Set `VITE_API_BASE_URL` in frontend deployment

### Environment Variables
**Backend (.env):**
```env
GOOGLE_API_KEY=your_gemini_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

**Frontend (.env.local):**
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

## Troubleshooting
- **CORS errors:** Ensure your frontend domain is added to `ALLOWED_ORIGINS` in backend
- **API errors:** Check your Gemini and Firecrawl API keys
- **Build failures:** Ensure all dependencies are installed and environment variables are set

## Tech Stack

### Frontend
- **React** 18 with TypeScript
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Modern UI/UX** with glassmorphism effects

### Backend
- **FastAPI** (Python web framework)
- **Python** 3.12+
- **Google Gemini** 2.0 Flash (LLM)
- **LangChain** (LLM orchestration)
- **Firecrawl** (Web scraping)
- **Server-Sent Events** (Real-time streaming)

### Deployment
- **Docker** (Containerization)
- **Vercel** (Frontend hosting)
- **Render** (Backend hosting)
- **GitHub** (Version control)

## Live Demo
- **Frontend**: [https://advanced-agent.vercel.app](https://advanced-agent.vercel.app)
- **Backend API**: [https://advanced-agent.onrender.com](https://advanced-agent.onrender.com)

---
Built with ❤️ by Riaz
