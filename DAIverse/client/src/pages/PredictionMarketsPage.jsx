import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { ethers } from 'ethers'
import '../styles/predictionMarkets.css'

// Import contract ABIs (these will be available after contract compilation)
import DAIPredictionMarketABI from '../artifacts/contracts/DAIPredictionMarket.sol/DAIPredictionMarket.json'

const PredictionMarketsPage = () => {
  const { account, isConnected, connectWallet, signer } = useWeb3()
  const [markets, setMarkets] = useState([])
  const [userMarkets, setUserMarkets] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [predictionMarketContract, setPredictionMarketContract] = useState(null)
  
  // New market form state
  const [isCreatingMarket, setIsCreatingMarket] = useState(false)
  const [newMarket, setNewMarket] = useState({
    title: '',
    description: '',
    category: 0, // Default to SPORTS
    outcomes: ['', ''],
    expiresAt: '',
    creatorFee: 100, // Default to 1%
  })

  // Selected market for betting
  const [selectedMarket, setSelectedMarket] = useState(null)
  const [betAmount, setBetAmount] = useState('')
  const [selectedOutcome, setSelectedOutcome] = useState('')

  // Contract address - this would come from environment variables or deployment
  const PREDICTION_MARKET_ADDRESS = import.meta.env.VITE_PREDICTION_MARKET_ADDRESS || '0x0000000000000000000000000000000000000000'

  // Categories mapping
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: '0', name: 'Sports' },
    { id: '1', name: 'Science' },
    { id: '2', name: 'Crypto' },
    { id: '3', name: 'Politics' },
    { id: '4', name: 'Entertainment' },
    { id: '5', name: 'Other' },
  ]

  // Market status mapping
  const marketStatus = {
    0: { name: 'Open', color: 'bg-green-100 text-green-800' },
    1: { name: 'Closed', color: 'bg-gray-100 text-gray-800' },
    2: { name: 'Resolved', color: 'bg-blue-100 text-blue-800' },
  }

  useEffect(() => {
    const initContract = async () => {
      if (signer && PREDICTION_MARKET_ADDRESS) {
        try {
          const contract = new ethers.Contract(
            PREDICTION_MARKET_ADDRESS,
            DAIPredictionMarketABI.abi,
            signer
          )
          setPredictionMarketContract(contract)
          console.log('Prediction Market contract initialized')
        } catch (error) {
          console.error('Error initializing prediction market contract:', error)
        }
      }
    }

    if (isConnected) {
      initContract()
    }
  }, [signer, isConnected, PREDICTION_MARKET_ADDRESS])

  useEffect(() => {
    // Fetch markets
    const fetchMarkets = async () => {
      if (!predictionMarketContract) return

      try {
        setIsLoading(true)
        
        // For demo purposes, we'll use mock data
        // In a real implementation, we would fetch from the blockchain
        setTimeout(() => {
          const mockMarkets = [
            {
              id: 1,
              title: 'Will Bitcoin reach $100,000 by end of 2023?',
              description: 'Market resolves to "Yes" if BTC price reaches $100,000 on any major exchange before January 1, 2024.',
              category: 2, // Crypto
              creator: '0x1234...5678',
              createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
              status: 0, // Open
              outcomes: ['Yes', 'No'],
              totalLiquidity: ethers.parseEther('1000'),
              bets: {
                'Yes': ethers.parseEther('600'),
                'No': ethers.parseEther('400')
              },
              userBets: {
                'Yes': ethers.parseEther('50'),
                'No': ethers.parseEther('0')
              },
              resolvedOutcome: '',
              creatorFee: 100, // 1%
            },
            {
              id: 2,
              title: 'Will the LA Lakers win the NBA Championship?',
              description: 'Market resolves to "Yes" if the LA Lakers win the NBA Championship for the current season.',
              category: 0, // Sports
              creator: '0x5678...1234',
              createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
              expiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000, // 180 days from now
              status: 0, // Open
              outcomes: ['Yes', 'No'],
              totalLiquidity: ethers.parseEther('2500'),
              bets: {
                'Yes': ethers.parseEther('1500'),
                'No': ethers.parseEther('1000')
              },
              userBets: {
                'Yes': ethers.parseEther('0'),
                'No': ethers.parseEther('100')
              },
              resolvedOutcome: '',
              creatorFee: 150, // 1.5%
            },
            {
              id: 3,
              title: 'Will SpaceX successfully land humans on Mars by 2030?',
              description: 'Market resolves to "Yes" if SpaceX successfully lands at least one human on the surface of Mars before January 1, 2031.',
              category: 1, // Science
              creator: '0x9876...5432',
              createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
              expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000 * 7, // 7 years from now
              status: 0, // Open
              outcomes: ['Yes', 'No'],
              totalLiquidity: ethers.parseEther('5000'),
              bets: {
                'Yes': ethers.parseEther('2000'),
                'No': ethers.parseEther('3000')
              },
              userBets: {
                'Yes': ethers.parseEther('200'),
                'No': ethers.parseEther('0')
              },
              resolvedOutcome: '',
              creatorFee: 200, // 2%
            },
            {
              id: 4,
              title: 'Will Ethereum 2.0 fully launch in 2023?',
              description: 'Market resolves to "Yes" if all phases of Ethereum 2.0 are fully implemented and live on mainnet before January 1, 2024.',
              category: 2, // Crypto
              creator: '0x2468...1357',
              createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
              expiresAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago (expired)
              status: 2, // Resolved
              outcomes: ['Yes', 'No'],
              totalLiquidity: ethers.parseEther('3000'),
              bets: {
                'Yes': ethers.parseEther('1200'),
                'No': ethers.parseEther('1800')
              },
              userBets: {
                'Yes': ethers.parseEther('0'),
                'No': ethers.parseEther('150')
              },
              resolvedOutcome: 'No',
              creatorFee: 100, // 1%
            },
          ]

          setMarkets(mockMarkets)
          
          // Set user markets (markets created by the user or where the user has placed bets)
          const userMkts = mockMarkets.filter(market => 
            market.creator === account || 
            market.userBets['Yes'] > 0 || 
            market.userBets['No'] > 0
          )
          setUserMarkets(userMkts)
          
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching markets:', error)
        setIsLoading(false)
      }
    }

    if (isConnected && predictionMarketContract) {
      fetchMarkets()
    }
  }, [account, isConnected, predictionMarketContract])

  // Filter markets based on category and search query
  const filteredMarkets = markets.filter((market) => {
    const matchesCategory = selectedCategory === 'all' || market.category.toString() === selectedCategory
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Handle new market form changes
  const handleMarketFormChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'outcomes') {
      // Split by comma and trim whitespace
      const outcomeArray = value.split(',').map(outcome => outcome.trim())
      setNewMarket({ ...newMarket, outcomes: outcomeArray })
    } else {
      setNewMarket({ ...newMarket, [name]: value })
    }
  }

  // Add outcome field
  const addOutcome = () => {
    setNewMarket({
      ...newMarket,
      outcomes: [...newMarket.outcomes, '']
    })
  }

  // Remove outcome field
  const removeOutcome = (index) => {
    if (newMarket.outcomes.length <= 2) return // Minimum 2 outcomes
    
    const updatedOutcomes = [...newMarket.outcomes]
    updatedOutcomes.splice(index, 1)
    setNewMarket({
      ...newMarket,
      outcomes: updatedOutcomes
    })
  }

  // Handle outcome change
  const handleOutcomeChange = (index, value) => {
    const updatedOutcomes = [...newMarket.outcomes]
    updatedOutcomes[index] = value
    setNewMarket({
      ...newMarket,
      outcomes: updatedOutcomes
    })
  }

  // Create new market
  const createMarket = async (e) => {
    e.preventDefault()
    
    if (!isConnected) {
      connectWallet()
      return
    }
    
    // Validate form
    if (!newMarket.title || !newMarket.description || !newMarket.expiresAt) {
      alert('Please fill in all required fields')
      return
    }
    
    // Validate outcomes
    const validOutcomes = newMarket.outcomes.filter(outcome => outcome.trim() !== '')
    if (validOutcomes.length < 2) {
      alert('Please provide at least two valid outcomes')
      return
    }
    
    try {
      // In a real implementation, we would call the contract method
      // await predictionMarketContract.createMarket(
      //   newMarket.title,
      //   newMarket.description,
      //   newMarket.category,
      //   validOutcomes,
      //   new Date(newMarket.expiresAt).getTime() / 1000,
      //   newMarket.creatorFee
      // )
      
      // For demo purposes, we'll just add to the local state
      const newId = markets.length + 1
      const mockNewMarket = {
        id: newId,
        title: newMarket.title,
        description: newMarket.description,
        category: parseInt(newMarket.category),
        creator: account,
        createdAt: Date.now(),
        expiresAt: new Date(newMarket.expiresAt).getTime(),
        status: 0, // Open
        outcomes: validOutcomes,
        totalLiquidity: ethers.parseEther('0'),
        bets: Object.fromEntries(validOutcomes.map(outcome => [outcome, ethers.parseEther('0')])),
        userBets: Object.fromEntries(validOutcomes.map(outcome => [outcome, ethers.parseEther('0')])),
        resolvedOutcome: '',
        creatorFee: parseInt(newMarket.creatorFee),
      }
      
      setMarkets([...markets, mockNewMarket])
      setUserMarkets([...userMarkets, mockNewMarket])
      
      // Reset form
      setNewMarket({
        title: '',
        description: '',
        category: 0,
        outcomes: ['', ''],
        expiresAt: '',
        creatorFee: 100,
      })
      
      setIsCreatingMarket(false)
      
      alert('Market created successfully!')
    } catch (error) {
      console.error('Error creating market:', error)
      alert('Failed to create market')
    }
  }

  // Place bet
  const placeBet = async (e) => {
    e.preventDefault()
    
    if (!isConnected) {
      connectWallet()
      return
    }
    
    if (!selectedMarket || !selectedOutcome || !betAmount || parseFloat(betAmount) <= 0) {
      alert('Please select a market, outcome, and enter a valid bet amount')
      return
    }
    
    try {
      // In a real implementation, we would call the contract method
      // await predictionMarketContract.placeBet(
      //   selectedMarket.id,
      //   selectedOutcome,
      //   ethers.parseEther(betAmount)
      // )
      
      // For demo purposes, we'll just update the local state
      const updatedMarkets = markets.map(market => {
        if (market.id === selectedMarket.id) {
          const betAmountBN = ethers.parseEther(betAmount)
          return {
            ...market,
            totalLiquidity: market.totalLiquidity + betAmountBN,
            bets: {
              ...market.bets,
              [selectedOutcome]: market.bets[selectedOutcome] + betAmountBN
            },
            userBets: {
              ...market.userBets,
              [selectedOutcome]: market.userBets[selectedOutcome] + betAmountBN
            }
          }
        }
        return market
      })
      
      setMarkets(updatedMarkets)
      
      // Update user markets
      const updatedUserMarkets = updatedMarkets.filter(market => 
        market.creator === account || 
        market.userBets['Yes'] > 0 || 
        market.userBets['No'] > 0 ||
        (market.outcomes.some(outcome => market.userBets[outcome] > 0))
      )
      setUserMarkets(updatedUserMarkets)
      
      // Reset form
      setSelectedMarket(null)
      setSelectedOutcome('')
      setBetAmount('')
      
      alert('Bet placed successfully!')
    } catch (error) {
      console.error('Error placing bet:', error)
      alert('Failed to place bet')
    }
  }

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format amount from wei to ETH with 2 decimal places
  const formatAmount = (amount) => {
    return parseFloat(ethers.formatEther(amount)).toFixed(2)
  }

  // Calculate odds for an outcome
  const calculateOdds = (market, outcome) => {
    if (!market.bets[outcome] || market.bets[outcome] === 0) return '∞'
    
    const totalBets = Object.values(market.bets).reduce((sum, bet) => sum + bet, 0)
    if (totalBets === 0) return '∞'
    
    const odds = totalBets / market.bets[outcome]
    return odds.toFixed(2)
  }

  // Calculate potential winnings
  const calculatePotentialWinnings = (market, outcome, amount) => {
    if (!amount || parseFloat(amount) <= 0) return '0.00'
    
    const betAmountBN = ethers.parseEther(amount)
    const totalBets = Object.values(market.bets).reduce((sum, bet) => sum + bet, 0)
    const outcomeTotal = market.bets[outcome]
    
    if (totalBets === 0 || outcomeTotal === 0) return amount
    
    const odds = totalBets / outcomeTotal
    const winnings = betAmountBN * odds
    const fee = (winnings * market.creatorFee) / 10000
    const netWinnings = winnings - fee
    
    return formatAmount(netWinnings)
  }

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Prediction Markets</h1>
        <p className="text-xl text-gray-600 mb-8">Connect your wallet to access prediction markets</p>
        <button
          onClick={connectWallet}
          className="btn-primary text-lg px-8 py-3"
        >
          Connect Wallet
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prediction Markets</h1>
          <p className="text-gray-600 mt-2">Bet on future events and earn rewards for correct predictions</p>
        </div>
        <button
          onClick={() => setIsCreatingMarket(!isCreatingMarket)}
          className="btn-primary mt-4 md:mt-0"
        >
          {isCreatingMarket ? 'Cancel' : 'Create Market'}
        </button>
      </div>

      {/* Create Market Form */}
      {isCreatingMarket && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Prediction Market</h2>
          <form onSubmit={createMarket}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Market Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newMarket.title}
                  onChange={handleMarketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="E.g., Will Bitcoin reach $100,000 by end of 2023?"
                  required
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newMarket.description}
                  onChange={handleMarketFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Provide clear resolution criteria for this market"
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newMarket.category}
                  onChange={handleMarketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.filter(cat => cat.id !== 'all').map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  name="expiresAt"
                  value={newMarket.expiresAt}
                  onChange={handleMarketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="creatorFee" className="block text-sm font-medium text-gray-700 mb-1">Creator Fee (%)</label>
                <input
                  type="number"
                  id="creatorFee"
                  name="creatorFee"
                  value={newMarket.creatorFee / 100}
                  onChange={(e) => setNewMarket({ ...newMarket, creatorFee: Math.round(parseFloat(e.target.value) * 100) })}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">Fee percentage you'll receive from winning bets (max 5%)</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcomes</label>
                <div className="space-y-2">
                  {newMarket.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => handleOutcomeChange(index, e.target.value)}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={`Outcome ${index + 1}`}
                        required
                      />
                      {index >= 2 && (
                        <button
                          type="button"
                          onClick={() => removeOutcome(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOutcome}
                  className="mt-2 text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Outcome
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCreatingMarket(false)}
                className="btn-outline mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Create Market
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Markets</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Search by title or description"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                selectedCategory === 'all' && searchQuery === ''
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
              }}
              disabled={userMarkets.length === 0}
            >
              All Markets
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                userMarkets.length > 0 ? 'text-gray-500 hover:text-gray-700 hover:border-gray-300' : 'text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => {
                if (userMarkets.length > 0) {
                  setSelectedCategory('user')
                  setSearchQuery('')
                }
              }}
              disabled={userMarkets.length === 0}
            >
              My Markets
            </button>
          </nav>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {(selectedCategory === 'user' ? userMarkets : filteredMarkets).map((market) => (
          <div key={market.id} className="market-card hover-scale overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium badge-futuristic ${marketStatus[market.status].color}`}>
                  {marketStatus[market.status].name}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium badge-futuristic bg-gray-100 text-gray-800">
                  {categories.find(cat => cat.id === market.category.toString())?.name}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 glow-text">{market.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{market.description}</p>
              
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Created: {formatDate(market.createdAt)}</span>
                <span>Expires: {formatDate(market.expiresAt)}</span>
              </div>
              
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Outcomes</div>
                <div className="space-y-2">
                  {market.outcomes.map((outcome) => (
                    <div key={outcome} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{outcome}</span>
                        {market.userBets[outcome] > 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                            Your bet: {formatAmount(market.userBets[outcome])} DAI
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium odds-display">{calculateOdds(market, outcome)}x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>Total Liquidity: {formatAmount(market.totalLiquidity)} DAI</span>
                <span>Fee: {market.creatorFee / 100}%</span>
              </div>
              
              {market.status === 0 && (
                <button
                  onClick={() => setSelectedMarket(market)}
                  className="w-full btn-holographic"
                >
                  Place Bet
                </button>
              )}
              
              {market.status === 2 && (
                <div className="text-center p-2 status-resolved rounded-md">
                  <span className="text-sm font-medium text-blue-800">
                    Resolved: <span className="font-bold">{market.resolvedOutcome}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Markets Message */}
      {(selectedCategory === 'user' ? userMarkets : filteredMarkets).length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {selectedCategory === 'user' ? 'You haven\'t participated in any markets yet' : 'No markets found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCategory === 'user' ? 'Create a market or place a bet to get started' : 'Try adjusting your search or filter criteria'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreatingMarket(true)}
              className="btn-primary"
            >
              Create Market
            </button>
          </div>
        </div>
      )}

      {/* Bet Modal */}
      {selectedMarket && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Place Bet on {selectedMarket.title}
                    </h3>
                    
                    <form onSubmit={placeBet}>
                      <div className="mb-4">
                        <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 mb-1">Select Outcome</label>
                        <select
                          id="outcome"
                          value={selectedOutcome}
                          onChange={(e) => setSelectedOutcome(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        >
                          <option value="">Select an outcome</option>
                          {selectedMarket.outcomes.map((outcome) => (
                            <option key={outcome} value={outcome}>{outcome} (Odds: {calculateOdds(selectedMarket, outcome)}x)</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700 mb-1">Bet Amount (DAI)</label>
                        <input
                          type="number"
                          id="betAmount"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          min="0.01"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter amount"
                          required
                        />
                      </div>

                      {selectedOutcome && betAmount && (
                        <div className="p-3 bg-gray-50 rounded-md mb-4">
                          <div className="text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Current Odds:</span>
                              <span className="font-medium">{calculateOdds(selectedMarket, selectedOutcome)}x</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Potential Winnings:</span>
                              <span className="font-medium">{calculatePotentialWinnings(selectedMarket, selectedOutcome, betAmount)} DAI</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm btn-holographic"
                        >
                          Place Bet
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMarket(null)
                            setSelectedOutcome('')
                            setBetAmount('')
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictionMarketsPage