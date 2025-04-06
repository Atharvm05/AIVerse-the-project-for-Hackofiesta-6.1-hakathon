import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

// Import feature logos
import learnEarnLogo from '../assets/learn-earn-logo.svg'
import aiPoweredLearningLogo from '../assets/ai-powered-learning-logo.svg'
import shareKnowledgeLogo from '../assets/share-knowledge-logo.svg'
import onChainVerificationLogo from '../assets/on-chain-verification-logo.svg'
import predictionMarketsLogo from '../assets/prediction-markets-logo.svg'

const LandingPage = () => {
  const { connectWallet, isConnected } = useWeb3()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/dashboard')
    } else {
      connectWallet()
    }
  }

  const features = [
    {
      title: 'Learn & Earn',
      description: 'Complete courses and challenges to earn tokens and NFT badges that prove your skills.',
      icon: <img src={learnEarnLogo} alt="Learn & Earn" className="h-10 w-10" />,
      onClick: (navigate, isConnected, connectWallet) => {
        if (!isConnected) {
          connectWallet();
        } else {
          navigate('/learn');
        }
      },
    },
    {
      title: 'AI-Powered Learning',
      description: 'Our AI generates personalized content, explains code, and recommends learning paths tailored to you.',
      icon: <img src={aiPoweredLearningLogo} alt="AI-Powered Learning" className="h-10 w-10" />,
      onClick: (navigate, isConnected, connectWallet) => {
        if (!isConnected) {
          connectWallet();
        } else {
          navigate('/dashboard');
        }
      },
    },
    {
      title: 'Share Knowledge',
      description: 'Create and publish your own courses or code modules and earn rewards when others learn from them.',
      icon: <img src={shareKnowledgeLogo} alt="Share Knowledge" className="h-10 w-10" />,
      onClick: (navigate, isConnected, connectWallet) => {
        if (!isConnected) {
          connectWallet();
        } else {
          navigate('/contribute');
        }
      },
    },
    {
      title: 'On-Chain Verification',
      description: 'All contributions and achievements are recorded on the blockchain, ensuring transparency and ownership.',
      icon: <img src={onChainVerificationLogo} alt="On-Chain Verification" className="h-10 w-10" />,
      onClick: (navigate, isConnected, connectWallet) => {
        if (!isConnected) {
          connectWallet();
        } else {
          navigate('/profile');
        }
      },
    },
    {
      title: 'Prediction Markets',
      description: 'Participate in decentralized prediction markets to forecast events and earn rewards for accurate predictions.',
      icon: <img src={predictionMarketsLogo} alt="Prediction Markets" className="h-10 w-10" />,
      onClick: (navigate, isConnected, connectWallet) => {
        if (!isConnected) {
          connectWallet();
        } else {
          navigate('/prediction-markets');
        }
      },
    },
  ]

  return (
    <div className="">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden gradient-bg">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <a href="#" className="inline-flex space-x-6">
                    <span className="rounded-full bg-primary-600/10 px-3 py-1 text-sm font-semibold leading-6 text-primary-600 ring-1 ring-inset ring-primary-600/10">
                      Now in Beta
                    </span>
                  </a>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  Learn, Earn, and Share with <span className="glow-text">DAIverse</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  A decentralized AI-powered platform where you can learn new skills, earn rewards, and share your knowledge with the world.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <button
                    onClick={handleGetStarted}
                    className="btn-primary text-base font-semibold py-3 px-6"
                  >
                    {isConnected ? 'Go to Dashboard' : 'Connect Wallet to Start'}
                  </button>
                  <a href="#features" className="text-sm font-semibold leading-6 text-white glow-purple">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-primary-600/10 ring-1 ring-primary-50 md:-mr-20 lg:-mr-36" aria-hidden="true" />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-primary-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-primary-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" aria-hidden="true" />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                      <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                        <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                          <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                            DAIverse.sol
                          </div>
                          <div className="border-r border-gray-600/10 px-4 py-2">
                            App.jsx
                          </div>
                        </div>
                      </div>
                      <div className="px-6 pt-6 pb-14 text-white">
                        <pre className="text-sm leading-6 text-gray-300">
                          <code>
                            <span className="text-primary-400">// Smart contract for DAIverse platform</span>{' '}
                            <br />
                            <span className="text-gray-500">pragma solidity ^0.8.17;</span>{' '}
                            <br />
                            <br />
                            <span className="text-purple-400">contract</span>{' '}
                            <span className="text-blue-400">DAIverse</span> {'{'}
                            <br />
                            {'  '}<span className="text-purple-400">mapping</span>(address =&gt; <span className="text-purple-400">uint256</span>) <span className="text-blue-400">public</span> userReputationScore;
                            <br />
                            {'  '}<span className="text-purple-400">mapping</span>(address =&gt; <span className="text-purple-400">uint256</span>) <span className="text-blue-400">public</span> tokenBalance;
                            <br />
                            <br />
                            {'  '}<span className="text-green-400">function</span> <span className="text-yellow-400">completeModule</span>(<span className="text-purple-400">uint256</span> moduleId) <span className="text-blue-400">public</span> {'{'}
                            <br />
                            {'    '}<span className="text-gray-500">// Update user progress and mint rewards</span>
                            <br />
                            {'    '}userReputationScore[msg.sender] += 10;
                            <br />
                            {'    '}tokenBalance[msg.sender] += 50;
                            <br />
                            {'    '}<span className="text-gray-500">// Emit completion event</span>
                            <br />
                            {'  '}{'}'}
                            <br />
                            {'}'}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Learn Faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to accelerate your learning journey
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              DAIverse combines the power of blockchain, AI, and community to create a revolutionary learning experience.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div 
                  key={feature.title} 
                  className="relative pl-16 cursor-pointer transition-transform hover:scale-105" 
                  onClick={() => feature.onClick ? feature.onClick(navigate, isConnected, connectWallet) : null}
                >
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to start your learning journey?
            <br />
            Join DAIverse today.
          </h2>
          <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
            <button
              onClick={handleGetStarted}
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {isConnected ? 'Go to Dashboard' : 'Connect Wallet'}
            </button>
            <a href="#" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage