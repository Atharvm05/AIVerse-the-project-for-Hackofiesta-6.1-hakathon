import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

const NewsletterCuratorPage = () => {
  const { account, curateNewsletters, aiAgentLoading } = useWeb3();
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Fetch available newsletter sources
  useEffect(() => {
    const fetchSources = async () => {
      try {
        // In a real implementation, this would call the backend API
        const response = await fetch('/api/ai-agents/newsletters/sources');
        const data = await response.json();
        
        if (data.success) {
          setSources(data.sources);
        } else {
          setError(data.error || 'Failed to fetch newsletter sources');
        }
      } catch (error) {
        console.error('Error fetching newsletter sources:', error);
        setError('Failed to fetch newsletter sources. Please try again.');
      }
    };

    fetchSources();
  }, []);

  // Handle source selection
  const handleSourceToggle = (sourceId) => {
    setSelectedSources(prev => {
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
    
    if (selectedSources.length === 0) {
      setError('Please select at least one newsletter source');
      return;
    }
    
    setError(null);
    
    // Use the context function to curate newsletters
    const result = await curateNewsletters(selectedSources);
    
    if (result.success) {
      setResults(result.results);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold glow-text">AI-Crypto Newsletter Curator</h1>
        <p className="text-gray-400 mt-2">
          Select newsletters to curate and get AI-powered summaries and insights from the latest crypto content.
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
            <h2 className="text-xl font-semibold mb-4">Select Newsletters</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`source-${source.id}`}
                      checked={selectedSources.includes(source.id)}
                      onChange={() => handleSourceToggle(source.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded"
                    />
                    <label htmlFor={`source-${source.id}`} className="ml-3 text-gray-300">
                      {source.name}
                    </label>
                  </div>
                ))}
              </div>
              
              <button
                type="submit"
                disabled={aiAgentLoading || selectedSources.length === 0}
                className={`w-full btn-primary ${(aiAgentLoading || selectedSources.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {aiAgentLoading ? 'Curating...' : 'Curate Newsletters'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {aiAgentLoading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-300">Processing newsletters with Heurist AI...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              {results.map((result) => (
                <div key={result.id} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-xl p-6 glow-border">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{result.name}</h3>
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Visit Source
                    </a>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-medium mb-2">Summary</h4>
                    <p className="text-gray-300">{result.summary}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-medium mb-2">Key Insights</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {result.insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400">Sentiment:</span>
                    <span className={`ml-2 text-sm px-2 py-1 rounded ${result.sentiment === 'positive' ? 'bg-green-900 text-green-300' : result.sentiment === 'negative' ? 'bg-red-900 text-red-300' : 'bg-gray-700 text-gray-300'}`}>
                      {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-300 mb-2">Select newsletters and click "Curate Newsletters" to get started</p>
              <p className="text-gray-500 text-sm">The AI will analyze and summarize the latest content from your selected sources</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterCuratorPage;