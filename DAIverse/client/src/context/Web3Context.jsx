import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Import contract ABIs (these will be available after contract compilation)
// These imports are now available after running 'npx hardhat compile'
import DAITokenABI from '../artifacts/contracts/DAIToken.sol/DAIToken.json';
import DAIBadgeABI from '../artifacts/contracts/DAIBadge.sol/DAIBadge.json';
import DAIModuleABI from '../artifacts/contracts/DAIModule.sol/DAIModule.json';

// Create context
const Web3Context = createContext();

// Provider component
export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [aiAgentLoading, setAiAgentLoading] = useState(false);
  
  // Contract instances
  const [daiToken, setDaiToken] = useState(null);
  const [daiBadge, setDaiBadge] = useState(null);
  const [daiModule, setDaiModule] = useState(null);
  
  // Contract addresses - these would come from environment variables or deployment
  const DAI_TOKEN_ADDRESS = import.meta.env.VITE_DAI_TOKEN_ADDRESS;
  const DAI_BADGE_ADDRESS = import.meta.env.VITE_DAI_BADGE_ADDRESS;
  const DAI_MODULE_ADDRESS = import.meta.env.VITE_DAI_MODULE_ADDRESS;
  
  // Initialize provider
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          
          // Check if previously connected
          const savedAddress = localStorage.getItem('walletAddress');
          if (savedAddress) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Error initializing provider:', error);
        }
      }
    };
    
    initProvider();
  }, []);
  
  // Initialize contract instances when provider and signer are available
  useEffect(() => {
    const initContracts = async () => {
      if (provider && signer && DAI_TOKEN_ADDRESS && DAI_BADGE_ADDRESS && DAI_MODULE_ADDRESS) {
        try {
          // Initialize token contract
          const tokenContract = new ethers.Contract(
            DAI_TOKEN_ADDRESS,
            DAITokenABI.abi,
            signer
          );
          setDaiToken(tokenContract);
          
          // Initialize badge contract
          const badgeContract = new ethers.Contract(
            DAI_BADGE_ADDRESS,
            DAIBadgeABI.abi,
            signer
          );
          setDaiBadge(badgeContract);
          
          // Initialize module contract
          const moduleContract = new ethers.Contract(
            DAI_MODULE_ADDRESS,
            DAIModuleABI.abi,
            signer
          );
          setDaiModule(moduleContract);
          
          console.log('Contract instances initialized');
        } catch (error) {
          console.error('Error initializing contracts:', error);
          toast.error('Failed to initialize contracts');
        }
      }
    };
    
    initContracts();
  }, [provider, signer, DAI_TOKEN_ADDRESS, DAI_BADGE_ADDRESS, DAI_MODULE_ADDRESS]);
  
  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);
  
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      disconnectWallet();
      toast.info('Wallet disconnected');
    } else {
      // Account changed
      setAccount(accounts[0]);
      localStorage.setItem('walletAddress', accounts[0]);
      toast.success('Account changed');
    }
  };
  
  const handleChainChanged = (chainIdHex) => {
    const newChainId = parseInt(chainIdHex, 16);
    setChainId(newChainId);
    window.location.reload();
  };
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not installed. Please install MetaMask to use this app.');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      
      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setIsConnected(true);
      
      localStorage.setItem('walletAddress', accounts[0]);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    
    localStorage.removeItem('walletAddress');
    toast.info('Wallet disconnected');
  };
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // DAIToken functions
  const getTokenBalance = async (address) => {
    if (!daiToken) return 0;
    try {
      const balance = await daiToken.balanceOf(address || account);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  };

  // DAIBadge functions
  const getUserBadges = async (address) => {
    if (!daiBadge) return [];
    try {
      const tokenIds = await daiBadge.getBadgesByOwner(address || account);
      const badges = [];
      
      for (const tokenId of tokenIds) {
        const badge = await daiBadge.getBadge(tokenId);
        badges.push({
          tokenId: tokenId.toString(),
          name: badge.name,
          description: badge.description,
          badgeType: badge.badgeType,
          issuedAt: new Date(Number(badge.issuedAt) * 1000)
        });
      }
      
      return badges;
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  };

  // DAIModule functions
  const getAllModules = async () => {
    if (!daiModule) return [];
    try {
      const modules = await daiModule.getAllModules();
      return modules.map(module => ({
        id: module.id.toString(),
        title: module.title,
        description: module.description,
        category: module.category,
        difficulty: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'][module.difficulty],
        author: module.author,
        xpReward: module.xpReward.toString(),
        tokenReward: module.tokenReward.toString(),
        contentURI: module.contentURI,
        createdAt: new Date(Number(module.createdAt) * 1000),
        status: ['PENDING', 'APPROVED', 'REJECTED'][module.status],
        upvotes: module.upvotes.toString()
      }));
    } catch (error) {
      console.error('Error getting all modules:', error);
      return [];
    }
  };

  const getModulesByCategory = async (category) => {
    if (!daiModule) return [];
    try {
      const modules = await daiModule.getModulesByCategory(category);
      return modules.map(module => ({
        id: module.id.toString(),
        title: module.title,
        description: module.description,
        category: module.category,
        difficulty: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'][module.difficulty],
        author: module.author,
        xpReward: module.xpReward.toString(),
        tokenReward: module.tokenReward.toString(),
        contentURI: module.contentURI,
        createdAt: new Date(Number(module.createdAt) * 1000),
        status: ['PENDING', 'APPROVED', 'REJECTED'][module.status],
        upvotes: module.upvotes.toString()
      }));
    } catch (error) {
      console.error('Error getting modules by category:', error);
      return [];
    }
  };

  const completeModule = async (moduleId, score) => {
    if (!daiModule) throw new Error('Module contract not initialized');
    try {
      const tx = await daiModule.completeModule(moduleId, score);
      await tx.wait();
      toast.success('Module completed successfully!');
      return true;
    } catch (error) {
      console.error('Error completing module:', error);
      toast.error('Failed to complete module');
      return false;
    }
  };

  const createModule = async (title, description, category, difficulty, xpReward, tokenReward, contentURI) => {
    if (!daiModule) throw new Error('Module contract not initialized');
    try {
      const tx = await daiModule.createModule(
        title,
        description,
        category,
        difficulty,
        xpReward,
        tokenReward,
        contentURI
      );
      await tx.wait();
      toast.success('Module created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module');
      return false;
    }
  };

  const upvoteModule = async (moduleId) => {
    if (!daiModule) throw new Error('Module contract not initialized');
    try {
      const tx = await daiModule.upvoteModule(moduleId);
      await tx.wait();
      toast.success('Module upvoted successfully!');
      return true;
    } catch (error) {
      console.error('Error upvoting module:', error);
      toast.error('Failed to upvote module');
      return false;
    }
  };

  const getUserXP = async (address) => {
    if (!daiModule) return 0;
    try {
      const xp = await daiModule.userXP(address || account);
      return xp.toString();
    } catch (error) {
      console.error('Error getting user XP:', error);
      return 0;
    }
  };
  
  // AI Agent Functions
  const curateNewsletters = async (sources) => {
    try {
      setAiAgentLoading(true);
      const response = await fetch('/api/ai-agents/newsletters/curate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sources }),
      });
      
      const data = await response.json();
      setAiAgentLoading(false);
      
      if (data.success) {
        return { success: true, results: data.results };
      } else {
        return { success: false, error: data.error || 'Failed to curate newsletters' };
      }
    } catch (error) {
      console.error('Error curating newsletters:', error);
      setAiAgentLoading(false);
      return { success: false, error: 'Failed to curate newsletters. Please try again.' };
    }
  };

  const searchResearchPapers = async (query, sources, limit) => {
    try {
      setAiAgentLoading(true);
      const response = await fetch('/api/ai-agents/research/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, sources, limit }),
      });
      
      const data = await response.json();
      setAiAgentLoading(false);
      
      if (data.success) {
        return { success: true, results: data.results };
      } else {
        return { success: false, error: data.error || 'Failed to search research papers' };
      }
    } catch (error) {
      console.error('Error searching research papers:', error);
      setAiAgentLoading(false);
      return { success: false, error: 'Failed to search research papers. Please try again.' };
    }
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        formatAddress,
        // Contract instances
        daiToken,
        daiBadge,
        daiModule,
        // Token functions
        getTokenBalance,
        // Badge functions
        getUserBadges,
        // Module functions
        getAllModules,
        getModulesByCategory,
        completeModule,
        createModule,
        upvoteModule,
        getUserXP,
        // AI Agent functions
        aiAgentLoading,
        curateNewsletters,
        searchResearchPapers,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};