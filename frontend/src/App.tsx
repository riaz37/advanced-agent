import { useState } from 'react'
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

function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔎 Developer Tools Research Agent
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Research and compare developer tools using advanced LLM and web research workflows.
            Enter your query (e.g., "API monitoring tools") and get structured, actionable insights.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your research query..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Researching...
                </>
              ) : (
                'Research'
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-600 mt-2 text-sm">{error}</p>
          )}
        </div>

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
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
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
