import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

const Dashboard = () => {
  const { account } = useWeb3()
  const [userStats, setUserStats] = useState({
    xp: 0,
    tokens: 0,
    reputation: 0,
    completedModules: 0,
    contributedModules: 0,
    streak: 0,
  })
  const [featuredModules, setFeaturedModules] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch user stats and featured modules
    // This would normally come from the backend/blockchain
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
          // Mock data
          setUserStats({
            xp: 1250,
            tokens: 75,
            reputation: 420,
            completedModules: 8,
            contributedModules: 2,
            streak: 5,
          })

          setFeaturedModules([
            {
              id: 1,
              title: 'Introduction to Blockchain',
              description: 'Learn the fundamentals of blockchain technology and how it works.',
              difficulty: 'Beginner',
              duration: '2 hours',
              rewards: 50,
              image: 'https://via.placeholder.com/300x200',
              progress: 100,
            },
            {
              id: 2,
              title: 'Smart Contract Development',
              description: 'Learn how to write and deploy smart contracts on Ethereum.',
              difficulty: 'Intermediate',
              duration: '4 hours',
              rewards: 100,
              image: 'https://via.placeholder.com/300x200',
              progress: 60,
            },
            {
              id: 3,
              title: 'Web3 Frontend Integration',
              description: 'Connect your frontend applications to blockchain networks.',
              difficulty: 'Intermediate',
              duration: '3 hours',
              rewards: 75,
              image: 'https://via.placeholder.com/300x200',
              progress: 0,
            },
            {
              id: 4,
              title: 'AI in Blockchain Applications',
              description: 'Explore how AI can enhance blockchain applications and use cases.',
              difficulty: 'Advanced',
              duration: '5 hours',
              rewards: 150,
              image: 'https://via.placeholder.com/300x200',
              progress: 0,
            },
          ])

          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setIsLoading(false)
      }
    }

    if (account) {
      fetchDashboardData()
    }
  }, [account])

  // Progress bar component
  const ProgressBar = ({ progress }) => {
    return (
      <div className="w-full progress-futuristic">
        <div
          className="bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    )
  }

  // Stat card component
  const StatCard = ({ title, value, icon }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div className="rounded-full bg-primary-100 p-3 mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your learning progress and rewards.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="XP Points"
          value={userStats.xp}
          icon={
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatCard
          title="DAI Tokens"
          value={userStats.tokens}
          icon={
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Reputation Score"
          value={userStats.reputation}
          icon={
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <StatCard
          title="Learning Streak"
          value={`${userStats.streak} days`}
          icon={
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
        />
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Completed Modules</span>
              <span className="text-gray-900 font-medium">{userStats.completedModules}</span>
            </div>
            <ProgressBar progress={(userStats.completedModules / 20) * 100} />
            <p className="text-sm text-gray-500 mt-2">You've completed {userStats.completedModules} out of 20 modules</p>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Contributed Content</span>
              <span className="text-gray-900 font-medium">{userStats.contributedModules}</span>
            </div>
            <ProgressBar progress={(userStats.contributedModules / 5) * 100} />
            <p className="text-sm text-gray-500 mt-2">You've contributed to {userStats.contributedModules} modules</p>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
          <Link to="/learn" className="text-primary-600 hover:text-primary-700 font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredModules.map((module) => (
            <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={module.image} alt={module.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-1">{module.difficulty}</span>
                  <span className="text-xs font-medium text-primary-600">{module.duration}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{module.description}</p>
                <div className="mb-2">
                  <ProgressBar progress={module.progress} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{module.progress}% complete</span>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">{module.rewards} tokens</span>
                  </div>
                </div>
                <Link
                  to={`/learn/${module.id}`}
                  className="mt-4 block text-center text-sm font-medium text-white bg-primary-600 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  {module.progress === 0 ? 'Start Learning' : module.progress === 100 ? 'Review Module' : 'Continue'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended for You */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
          <Link to="/learn" className="text-primary-600 hover:text-primary-700 font-medium">View All</Link>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendation</h3>
              <p className="text-gray-600 mt-1">
                Based on your learning history, we recommend exploring <strong>DeFi Protocols</strong> and <strong>NFT Development</strong> next.
              </p>
              <div className="mt-4 flex space-x-4">
                <Link
                  to="/learn?category=defi"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Explore DeFi Courses
                </Link>
                <Link
                  to="/learn?category=nft"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Explore NFT Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard