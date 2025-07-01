import { useState, useEffect } from 'react'
import { Search, Loader2, ExternalLink, Code, DollarSign, Users } from 'lucide-react'
import axios from 'axios'
import './App.css'

interface Company {
  name: string
  website: string
  description: string
  pricing_model: string
  is_open_source: boolean
  api_available: boolean
  tech_stack: string[]
  language_support: string[]
  integration_capabilities: string[]
  developer_experience_rating: number
  competitors: string[]
}

interface ResearchResponse {
  query: string
  extracted_tools: string[]
  companies: Company[]
  analysis: string
  status: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const loadingMessages = [
  "🔍 Analyzing your query...",
  "🌐 Searching the web for tools...",
  "🤖 AI is processing the data...",
  "📊 Structuring the results...",
  "✨ Almost ready with insights...",
  "🚀 Finalizing your research..."
]

const funFacts = [
  "💡 Did you know? The first web browser was called WorldWideWeb!",
  "🎯 Fun fact: JavaScript was created in just 10 days!",
  "⚡ Cool! React was originally created for Facebook's newsfeed.",
  "🔧 Interesting: Git was created by Linus Torvalds in 2005.",
  "📱 Amazing: The first iPhone app was released in 2008!",
  "🌟 Wow! Stack Overflow gets 50+ million visitors monthly!"
]

function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [currentFact, setCurrentFact] = useState(0)

  // Loading progression effect
  useEffect(() => {
    let stepInterval: NodeJS.Timeout
    let factInterval: NodeJS.Timeout

    if (loading) {
      // Progress through loading steps
      stepInterval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length)
      }, 2000)

      // Rotate fun facts
      factInterval = setInterval(() => {
        setCurrentFact(prev => (prev + 1) % funFacts.length)
      }, 4000)
    } else {
      setLoadingStep(0)
      setCurrentFact(0)
    }

    return () => {
      clearInterval(stepInterval)
      clearInterval(factInterval)
    }
  }, [loading])

  const handleSearch = async () => {
    if (!query.trim() || query.trim().length < 3) {
      setError('Please enter at least 3 characters')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post<ResearchResponse>(`${API_BASE_URL}/research`, {
        query: query.trim()
      })
      setResult(response.data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while researching tools')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Developer Tools Research
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover and analyze developer tools with AI-powered research workflows.
            <br />
            <span className="text-slate-500">Enter your query and get structured, actionable insights.</span>
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleSearch()}
                  placeholder="Enter your research query (e.g., 'API monitoring tools')..."
                  className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/80 placeholder:text-slate-400"
                  disabled={loading}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim() || query.trim().length < 3}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Research
                  </>
                )}
              </button>
            </div>

            {/* Quick examples */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-slate-500">Try:</span>
              {['API monitoring tools', 'React state management', 'Database ORMs'].map((example) => (
                <button
                  key={example}
                  onClick={() => setQuery(example)}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  {example}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Engaging Loading Section */}
        {loading && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center animate-fade-in">
              {/* Main loading animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-purple-400"></div>
                </div>
              </div>

              {/* Loading message */}
              <h3 className="text-2xl font-semibold text-slate-700 mb-4 animate-pulse">
                {loadingMessages[loadingStep]}
              </h3>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 mb-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                ></div>
              </div>

              {/* Fun fact */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <p className="text-slate-600 text-lg animate-slide-up">
                  {funFacts[currentFact]}
                </p>
              </div>

              {/* Floating dots animation */}
              <div className="flex justify-center mt-6 space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            {/* Extracted Tools */}
            {result.extracted_tools.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Code className="h-6 w-6" />
                  Extracted Tools
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.extracted_tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Companies */}
            {result.companies.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Companies & Tool Details
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {result.companies.map((company, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200 cursor-default">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200"
                            title="Visit website"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{company.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Pricing:</span>
                          <span className="text-gray-600">{company.pricing_model}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium">Open Source:</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            company.is_open_source
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {company.is_open_source ? 'Yes' : 'No'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium">API Available:</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            company.api_available
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {company.api_available ? 'Yes' : 'No'}
                          </span>
                        </div>

                        {company.tech_stack.length > 0 && (
                          <div>
                            <span className="font-medium">Tech Stack:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {company.tech_stack.slice(0, 3).map((tech, techIndex) => (
                                <span key={techIndex} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                  {tech}
                                </span>
                              ))}
                              {company.tech_stack.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  +{company.tech_stack.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {company.developer_experience_rating > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">DX Rating:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < company.developer_experience_rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis */}
            {result.analysis && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  🤖 LLM Analysis & Recommendations
                </h2>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {result.analysis}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">Built with ❤️ by Riaz</p>
        </footer>
      </div>
    </div>
  )
}

export default App
