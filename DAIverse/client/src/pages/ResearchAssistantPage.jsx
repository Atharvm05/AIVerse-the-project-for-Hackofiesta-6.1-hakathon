import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

const ResearchAssistantPage = () => {
  const { account, searchResearchPapers, aiAgentLoading } = useWeb3();
  const [query, setQuery] = useState('');
  const [sources, setSources] = useState(['arxiv']);
  const [limit, setLimit] = useState(5);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Available research sources
  const availableSources = [
    { id: 'arxiv', name: 'arXiv' },
    { id: 'semantic-scholar', name: 'Semantic Scholar' },
    { id: 'papers-with-code', name: 'Papers With Code' },
    { id: 'crossref', name: 'Crossref' }
  ];

  // Handle source selection
  const handleSourceToggle = (sourceId) => {
    setSources(prev => {
      if (prev.includes(sourceId)) {
        return prev.filter(id => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }
    
    setError(null);
    
    // Use the context function to search research papers
    const result = await searchResearchPapers(query.trim(), sources, parseInt(limit));
    
    if (result.success) {
      setResults(result.results);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold glow-text">Research Assistant</h1>
        <p className="text-gray-400 mt-2">
          Search for research papers across academic sources and get AI-powered summaries and insights.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-xl p-6 glow-border">
            <h2 className="text-xl font-semibold mb-4">Search Parameters</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-1">
                  Search Query
                </label>
                <input
                  type="text"
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., blockchain AI integration"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sources
                </label>
                <div className="space-y-2">
                  {availableSources.map((source) => (
                    <div key={source.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`source-${source.id}`}
                        checked={sources.includes(source.id)}
                        onChange={() => handleSourceToggle(source.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded"
                      />
                      <label htmlFor={`source-${source.id}`} className="ml-3 text-gray-300">
                        {source.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="limit" className="block text-sm font-medium text-gray-300 mb-1">
                  Results Limit
                </label>
                <select
                  id="limit"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="3">3 papers</option>
                  <option value="5">5 papers</option>
                  <option value="10">10 papers</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={aiAgentLoading || !query.trim() || sources.length === 0}
                className={`w-full btn-primary ${(aiAgentLoading || !query.trim() || sources.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {aiAgentLoading ? 'Searching...' : 'Search Papers'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {aiAgentLoading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-300">Searching and analyzing papers with Heurist AI...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              {results.map((sourceResult, sourceIndex) => (
                <div key={sourceIndex} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-xl p-6 glow-border">
                  <h3 className="text-xl font-semibold mb-4">{sourceResult.sourceName}</h3>
                  
                  {sourceResult.papers.length > 0 ? (
                    <div className="space-y-6">
                      {sourceResult.papers.map((paper, paperIndex) => (
                        <div key={paperIndex} className="border-t border-gray-700 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-medium text-primary-300">{paper.title}</h4>
                            <a 
                              href={paper.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-300 text-sm ml-2 flex-shrink-0"
                            >
                              View Paper
                            </a>
                          </div>
                          
                          <div className="text-sm text-gray-400 mb-3">
                            {paper.authors.join(', ')} • {paper.published}
                          </div>
                          
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-300 mb-1">Abstract</h5>
                            <p className="text-gray-400 text-sm">{paper.abstract}</p>
                          </div>
                          
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-300 mb-1">AI Summary</h5>
                            <p className="text-gray-300">{paper.summary}</p>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-1">Key Insights</h5>
                            <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                              {paper.insights.map((insight, index) => (
                                <li key={index}>{insight}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No papers found from this source matching your query.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-gray-300 mb-2">Enter a search query and click "Search Papers" to get started</p>
              <p className="text-gray-500 text-sm">The AI will find and analyze relevant research papers from your selected sources</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchAssistantPage;