import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

const LearnPage = () => {
  const { account } = useWeb3()
  const [modules, setModules] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch learning modules and categories
    const fetchModules = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
          // Mock categories
          setCategories([
            { id: 'all', name: 'All Categories' },
            { id: 'blockchain', name: 'Blockchain Fundamentals' },
            { id: 'smart-contracts', name: 'Smart Contracts' },
            { id: 'web3', name: 'Web3 Development' },
            { id: 'defi', name: 'DeFi Protocols' },
            { id: 'nft', name: 'NFT Development' },
            { id: 'ai', name: 'AI Integration' },
          ])

          // Mock modules
          setModules([
            {
              id: 1,
              title: 'Introduction to Blockchain',
              description: 'Learn the fundamentals of blockchain technology and how it works.',
              category: 'blockchain',
              difficulty: 'Beginner',
              duration: '2 hours',
              rewards: 50,
              image: 'https://via.placeholder.com/300x200',
              author: '0x1234...5678',
              rating: 4.8,
              reviews: 124,
              progress: 100,
            },
            {
              id: 2,
              title: 'Smart Contract Development',
              description: 'Learn how to write and deploy smart contracts on Ethereum.',
              category: 'smart-contracts',
              difficulty: 'Intermediate',
              duration: '4 hours',
              rewards: 100,
              image: 'https://via.placeholder.com/300x200',
              author: '0x8765...4321',
              rating: 4.6,
              reviews: 98,
              progress: 60,
            },
            {
              id: 3,
              title: 'Web3 Frontend Integration',
              description: 'Connect your frontend applications to blockchain networks.',
              category: 'web3',
              difficulty: 'Intermediate',
              duration: '3 hours',
              rewards: 75,
              image: 'https://via.placeholder.com/300x200',
              author: '0x2468...1357',
              rating: 4.5,
              reviews: 87,
              progress: 0,
            },
            {
              id: 4,
              title: 'AI in Blockchain Applications',
              description: 'Explore how AI can enhance blockchain applications and use cases.',
              category: 'ai',
              difficulty: 'Advanced',
              duration: '5 hours',
              rewards: 150,
              image: 'https://via.placeholder.com/300x200',
              author: '0x1357...2468',
              rating: 4.9,
              reviews: 56,
              progress: 0,
            },
            {
              id: 5,
              title: 'DeFi Protocol Analysis',
              description: 'Understand how decentralized finance protocols work and interact.',
              category: 'defi',
              difficulty: 'Advanced',
              duration: '6 hours',
              rewards: 200,
              image: 'https://via.placeholder.com/300x200',
              author: '0x9876...5432',
              rating: 4.7,
              reviews: 72,
              progress: 0,
            },
            {
              id: 6,
              title: 'NFT Creation and Minting',
              description: 'Learn to create, mint, and trade NFTs on various platforms.',
              category: 'nft',
              difficulty: 'Intermediate',
              duration: '4 hours',
              rewards: 125,
              image: 'https://via.placeholder.com/300x200',
              author: '0x5432...9876',
              rating: 4.8,
              reviews: 93,
              progress: 0,
            },
            {
              id: 7,
              title: 'Blockchain Security Best Practices',
              description: 'Protect your blockchain applications from common vulnerabilities.',
              category: 'blockchain',
              difficulty: 'Advanced',
              duration: '5 hours',
              rewards: 175,
              image: 'https://via.placeholder.com/300x200',
              author: '0x3456...7890',
              rating: 4.9,
              reviews: 105,
              progress: 0,
            },
            {
              id: 8,
              title: 'Solidity Programming Language',
              description: 'Master Solidity for Ethereum smart contract development.',
              category: 'smart-contracts',
              difficulty: 'Intermediate',
              duration: '8 hours',
              rewards: 225,
              image: 'https://via.placeholder.com/300x200',
              author: '0x7890...3456',
              rating: 4.7,
              reviews: 118,
              progress: 0,
            },
          ])

          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching modules:', error)
        setIsLoading(false)
      }
    }

    if (account) {
      fetchModules()
    }
  }, [account])

  // Filter modules based on category and search query
  const filteredModules = modules.filter((module) => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Progress bar component
  const ProgressBar = ({ progress }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    )
  }

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating} ({module.reviews})</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learn</h1>
        <p className="text-gray-600 mt-2">Explore our learning modules and earn rewards as you learn.</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="input pl-10"
                placeholder="Search for modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AI-Powered Recommendation */}
      <div className="mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-100">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-primary-100 rounded-full p-3">
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Learning Recommendation</h3>
            <p className="text-gray-700 mt-1">
              Based on your learning history and goals, our AI recommends the <strong>"Web3 Frontend Integration"</strong> module to enhance your skills.
            </p>
            <div className="mt-4">
              <Link
                to="/learn/3"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View Recommendation
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      {filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <img src={module.image} alt={module.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-1">{module.difficulty}</span>
                  <span className="text-xs font-medium text-primary-600">{module.duration}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{module.description}</p>
                <div className="mb-4">
                  <StarRating rating={module.rating} />
                </div>
                {module.progress > 0 && (
                  <div className="mb-2">
                    <ProgressBar progress={module.progress} />
                    <span className="text-xs text-gray-500">{module.progress}% complete</span>
                  </div>
                )}
              </div>
              <div className="p-6 pt-0 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">{module.rewards} tokens</span>
                  </div>
                  <span className="text-xs text-gray-500">By {module.author.substring(0, 6)}...{module.author.substring(module.author.length - 4)}</span>
                </div>
                <Link
                  to={`/learn/${module.id}`}
                  className="block text-center text-sm font-medium text-white bg-primary-600 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  {module.progress === 0 ? 'Start Learning' : module.progress === 100 ? 'Review Module' : 'Continue'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No modules found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearnPage