import { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context'

const ProfilePage = () => {
  const { account, formatAddress } = useWeb3()
  const [userProfile, setUserProfile] = useState(null)
  const [nftBadges, setNftBadges] = useState([])
  const [completedModules, setCompletedModules] = useState([])
  const [contributedModules, setContributedModules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('badges')

  useEffect(() => {
    // Fetch user profile data
    const fetchProfileData = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
          // Mock user profile data
          setUserProfile({
            address: account,
            username: 'Web3 Explorer',
            bio: 'Passionate about blockchain technology and decentralized applications. Learning and contributing to the Web3 ecosystem.',
            joinedDate: '2023-06-15',
            xp: 1250,
            tokens: 75,
            reputation: 420,
            rank: 'Blockchain Apprentice',
            streak: 5,
            totalContributions: 2,
            totalCompletions: 8,
          })

          // Mock NFT badges
          setNftBadges([
            {
              id: 1,
              name: 'Blockchain Pioneer',
              description: 'Completed the Introduction to Blockchain module',
              image: 'https://via.placeholder.com/150',
              dateEarned: '2023-06-20',
              tokenId: '12345',
            },
            {
              id: 2,
              name: 'Smart Contract Developer',
              description: 'Completed the Smart Contract Development module',
              image: 'https://via.placeholder.com/150',
              dateEarned: '2023-07-05',
              tokenId: '12346',
            },
            {
              id: 3,
              name: 'Knowledge Contributor',
              description: 'Contributed a high-quality learning module',
              image: 'https://via.placeholder.com/150',
              dateEarned: '2023-07-15',
              tokenId: '12347',
            },
          ])

          // Mock completed modules
          setCompletedModules([
            {
              id: 1,
              title: 'Introduction to Blockchain',
              category: 'Blockchain Fundamentals',
              completedDate: '2023-06-20',
              score: 95,
              xpEarned: 250,
              tokensEarned: 25,
            },
            {
              id: 2,
              title: 'Smart Contract Development',
              category: 'Smart Contracts',
              completedDate: '2023-07-05',
              score: 88,
              xpEarned: 350,
              tokensEarned: 35,
            },
            {
              id: 3,
              title: 'Web3 Frontend Integration',
              category: 'Web3 Development',
              completedDate: '2023-07-25',
              score: 92,
              xpEarned: 300,
              tokensEarned: 30,
            },
          ])

          // Mock contributed modules
          setContributedModules([
            {
              id: 1,
              title: 'Building a DeFi Dashboard',
              category: 'Web3 Development',
              submittedDate: '2023-07-10',
              status: 'approved',
              upvotes: 24,
              tokensEarned: 150,
            },
            {
              id: 2,
              title: 'NFT Marketplace Integration',
              category: 'NFT Development',
              submittedDate: '2023-08-05',
              status: 'pending',
              upvotes: 8,
              tokensEarned: 0,
            },
          ])

          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching profile data:', error)
        setIsLoading(false)
      }
    }

    if (account) {
      fetchProfileData()
    }
  }, [account])

  // Tab component
  const Tab = ({ id, label, active, onClick }) => {
    return (
      <button
        className={`px-4 py-2 font-medium text-sm rounded-md ${active ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
        onClick={() => onClick(id)}
      >
        {label}
      </button>
    )
  }

  // Badge card component
  const BadgeCard = ({ badge }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 flex flex-col items-center">
          <img src={badge.image} alt={badge.name} className="w-24 h-24 object-cover rounded-lg mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">{badge.name}</h3>
          <p className="text-sm text-gray-600 text-center mb-3">{badge.description}</p>
          <div className="flex items-center text-xs text-gray-500">
            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Earned on {new Date(badge.dateEarned).toLocaleDateString()}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Token ID: {badge.tokenId}
          </div>
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
      {userProfile && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 h-32"></div>
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
                <div className="bg-white rounded-full p-2 shadow-lg mb-4 sm:mb-0">
                  <div className="bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full h-24 w-24 flex items-center justify-center text-white text-2xl font-bold">
                    {userProfile.username.charAt(0)}
                  </div>
                </div>
                <div className="sm:ml-6 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">{userProfile.username}</h1>
                  <p className="text-gray-500">{formatAddress(userProfile.address)}</p>
                </div>
                <div className="sm:ml-auto mt-4 sm:mt-0">
                  <button className="btn-outline">
                    Edit Profile
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Bio</h2>
                <p className="text-gray-700">{userProfile.bio}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">XP Points</p>
                  <p className="text-xl font-semibold text-gray-900">{userProfile.xp}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">DAI Tokens</p>
                  <p className="text-xl font-semibold text-gray-900">{userProfile.tokens}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Reputation</p>
                  <p className="text-xl font-semibold text-gray-900">{userProfile.reputation}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Rank</p>
                  <p className="text-xl font-semibold text-gray-900">{userProfile.rank}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {new Date(userProfile.joinedDate).toLocaleDateString()}
                <span className="mx-2">•</span>
                <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {userProfile.streak} day streak
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="px-6 py-4 flex space-x-4">
            <Tab id="badges" label="NFT Badges" active={activeTab === 'badges'} onClick={setActiveTab} />
            <Tab id="completed" label="Completed Modules" active={activeTab === 'completed'} onClick={setActiveTab} />
            <Tab id="contributed" label="Contributions" active={activeTab === 'contributed'} onClick={setActiveTab} />
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'badges' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">NFT Badges</h2>
                <span className="text-sm text-gray-500">{nftBadges.length} badges earned</span>
              </div>
              
              {nftBadges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nftBadges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No badges yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Complete modules to earn NFT badges.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'completed' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Completed Modules</h2>
                <span className="text-sm text-gray-500">{completedModules.length} modules completed</span>
              </div>
              
              {completedModules.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Module
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completed On
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rewards
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {completedModules.map((module) => (
                        <tr key={module.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{module.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{module.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{new Date(module.completedDate).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{module.score}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              <span className="font-medium text-primary-600">{module.xpEarned} XP</span> + <span className="font-medium text-yellow-600">{module.tokensEarned} tokens</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No completed modules</h3>
                  <p className="mt-1 text-sm text-gray-500">Start learning to complete modules and earn rewards.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'contributed' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Contributions</h2>
                <span className="text-sm text-gray-500">{contributedModules.length} contributions</span>
              </div>
              
              {contributedModules.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Module
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted On
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Upvotes
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rewards
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contributedModules.map((module) => (
                        <tr key={module.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{module.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{module.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{new Date(module.submittedDate).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${module.status === 'approved' ? 'bg-green-100 text-green-800' : module.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{module.upvotes}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-yellow-600">{module.tokensEarned} tokens</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No contributions yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Share your knowledge by contributing learning modules.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage