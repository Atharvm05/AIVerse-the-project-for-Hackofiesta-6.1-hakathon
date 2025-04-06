import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layouts
import MainLayout from './layouts/MainLayout'

// Pages
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import LearnPage from './pages/LearnPage'
import ContributePage from './pages/ContributePage'
import ProfilePage from './pages/ProfilePage'
import PredictionMarketsPage from './pages/PredictionMarketsPage'
import NewsletterCuratorPage from './pages/NewsletterCuratorPage'
import ResearchAssistantPage from './pages/ResearchAssistantPage'

// Context
import { Web3Provider } from './context/Web3Context'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated (has connected wallet)
  useEffect(() => {
    const checkAuth = async () => {
      const accounts = localStorage.getItem('walletAddress')
      if (accounts) {
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [])

  return (
    <Web3Provider>
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false}
        theme="dark"
        toastClassName="holographic-card"
        progressClassName="progress-futuristic"
        toastStyle={{
          background: 'rgba(31, 41, 55, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 15px rgba(56, 189, 248, 0.3)'
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route 
            path="dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="learn" 
            element={isAuthenticated ? <LearnPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="contribute" 
            element={isAuthenticated ? <ContributePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="profile" 
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="prediction-markets" 
            element={isAuthenticated ? <PredictionMarketsPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="newsletter-curator" 
            element={isAuthenticated ? <NewsletterCuratorPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="research-assistant" 
            element={isAuthenticated ? <ResearchAssistantPage /> : <Navigate to="/" />} 
          />
        </Route>
      </Routes>
    </Web3Provider>
  )
}

export default App