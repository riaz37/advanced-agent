# Advanced Agent: Developer Tools Research Agent

## Overview
Advanced Agent is an AI-powered research assistant that helps you discover, compare, and analyze developer tools. Leveraging LLMs (Gemini), web scraping, and structured workflows, it provides actionable insights and recommendations for any developer tool query.

## Features
- 🔍 **Automated Research**: Finds and analyzes articles and official sources for your query.
- 🛠️ **Tool Extraction**: Identifies relevant tools and competitors from web content.
- 🏢 **Company Analysis**: Scrapes and summarizes company websites, extracting pricing, tech stack, open source status, API availability, and more.
- 🤖 **LLM-Powered Recommendations**: Uses Gemini LLM to generate structured analysis and recommendations.
- 🖥️ **Modern Streamlit UI**: User-friendly interface for inputting queries and viewing results.

## How It Works
1. **User Query**: Enter a research query (e.g., "API monitoring tools") in the Streamlit UI.
2. **Workflow**: The backend workflow (in `src/worlflow.py`) runs three main steps:
   - Extracts tool names from web search results and articles.
   - Researches each tool/company, scraping their official sites and analyzing content.
   - Uses an LLM to generate a final analysis and recommendations.
3. **Results**: The UI displays extracted tools, detailed company info, and LLM-generated recommendations.

## Setup Instructions
### Prerequisites
- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (for fast dependency management)

### Installation
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/riaz37/advanced-agent.git]
   cd advanced-agent
   ```
2. **Install dependencies:**
   ```bash
   uv pip install -r requirements.txt
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in any required API keys (e.g., for Gemini, Firecrawl, etc.).

### Running the App
Start the Streamlit UI:
```bash
streamlit run streamlit_app.py
```
- Open [http://localhost:8501](http://localhost:8501) in your browser.

## Usage
1. Enter a research query (e.g., "API monitoring tools").
2. Click **Run Research**.
3. View extracted tools, company details, and LLM recommendations in the results.

## Example Query
- **Input:** `API monitoring tools`
- **Output:**
  - List of relevant tools (e.g., Postman, Runscope, etc.)
  - Company info: website, description, pricing, tech stack, open source status, API, language support, integrations, competitors
  - LLM-generated summary and recommendations

## Troubleshooting
- **Streamlit not installing:** Use `uv pip install streamlit` with a higher timeout if you have network issues.
- **Firecrawl errors (502):** Check your API keys and network connection. Firecrawl may be down or rate-limited.
- **Other issues:** Ensure all dependencies are installed and your Python version matches requirements.

## Tech Stack & Credits
- **Python 3.12+**
- **Streamlit** (UI)
- **LangChain** & **Gemini** (LLM)
- **Firecrawl** (Web scraping/search)
- **uv** (Dependency management)

---
Built with ❤️ by Riaz.
