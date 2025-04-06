const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ethers } = require('ethers');
const { OpenAI } = require('openai');
const multer = require('multer');
const { Web3Storage, File } = require('web3.storage');
const axios = require('axios');
const cheerio = require('cheerio');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const aiAgentsRoutes = require('./routes/aiAgents');

// Use routes
app.use('/api/ai-agents', aiAgentsRoutes);

// Initialize Web3Storage client for IPFS storage
function getWeb3StorageClient() {
  return new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });
}

// Initialize OpenAI client for AI integration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Ethereum provider and contract instances
let provider;
let daiToken;
let daiBadge;
let daiModule;

const initializeContracts = async () => {
  try {
    // Connect to local hardhat node in development
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
    
    // Load contract ABIs
    const DAITokenABI = require('../client/src/artifacts/contracts/DAIToken.sol/DAIToken.json').abi;
    const DAIBadgeABI = require('../client/src/artifacts/contracts/DAIBadge.sol/DAIBadge.json').abi;
    const DAIModuleABI = require('../client/src/artifacts/contracts/DAIModule.sol/DAIModule.json').abi;
    
    // Contract addresses from deployment
    const DAI_TOKEN_ADDRESS = process.env.DAI_TOKEN_ADDRESS;
    const DAI_BADGE_ADDRESS = process.env.DAI_BADGE_ADDRESS;
    const DAI_MODULE_ADDRESS = process.env.DAI_MODULE_ADDRESS;
    
    // Initialize contract instances
    daiToken = new ethers.Contract(DAI_TOKEN_ADDRESS, DAITokenABI, provider);
    daiBadge = new ethers.Contract(DAI_BADGE_ADDRESS, DAIBadgeABI, provider);
    daiModule = new ethers.Contract(DAI_MODULE_ADDRESS, DAIModuleABI, provider);
    
    console.log('Contracts initialized successfully');
  } catch (error) {
    console.error('Error initializing contracts:', error);
  }
};

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Get all modules
app.get('/api/modules', async (req, res) => {
  try {
    const modules = await daiModule.getAllModules();
    res.status(200).json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Get modules by category
app.get('/api/modules/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const modules = await daiModule.getModulesByCategory(category);
    res.status(200).json(modules);
  } catch (error) {
    console.error('Error fetching modules by category:', error);
    res.status(500).json({ error: 'Failed to fetch modules by category' });
  }
});

// Get user profile data
app.get('/api/users/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Get user XP
    const xp = await daiModule.getUserXP(address);
    
    // Get token balance
    const tokenBalance = await daiToken.balanceOf(address);
    
    // Get completed modules
    const completedModuleIds = await daiModule.getCompletedModules(address);
    
    // Get contributed modules
    const contributedModuleIds = await daiModule.getContributedModules(address);
    
    // Get NFT badges
    const badgeBalance = await daiBadge.balanceOf(address);
    const badges = [];
    
    for (let i = 0; i < badgeBalance; i++) {
      const tokenId = await daiBadge.tokenOfOwnerByIndex(address, i);
      const badge = await daiBadge.getBadge(tokenId);
      const tokenURI = await daiBadge.tokenURI(tokenId);
      
      badges.push({
        id: tokenId.toString(),
        name: badge.name,
        description: badge.description,
        badgeType: badge.badgeType,
        issuedAt: new Date(badge.issuedAt * 1000).toISOString(),
        tokenURI
      });
    }
    
    // Calculate reputation based on XP and contributions
    const reputation = parseInt(xp) + (contributedModuleIds.length * 50);
    
    // Determine rank based on XP
    let rank = 'Novice';
    if (xp > 5000) rank = 'Blockchain Master';
    else if (xp > 3000) rank = 'Blockchain Expert';
    else if (xp > 1000) rank = 'Blockchain Apprentice';
    else if (xp > 500) rank = 'Blockchain Enthusiast';
    
    res.status(200).json({
      address,
      xp: xp.toString(),
      tokens: ethers.formatEther(tokenBalance),
      reputation,
      rank,
      completedModules: completedModuleIds.map(id => id.toString()),
      contributedModules: contributedModuleIds.map(id => id.toString()),
      badges
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Upload module content to IPFS
app.post('/api/modules/upload', upload.array('files'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Prepare files for Web3.Storage
    const web3Files = files.map(file => {
      return new File([file.buffer], file.originalname, { type: file.mimetype });
    });
    
    // Upload to IPFS
    const client = getWeb3StorageClient();
    const cid = await client.put(web3Files);
    
    // Create metadata file
    const metadata = {
      title,
      description,
      files: files.map(file => file.originalname),
      timestamp: new Date().toISOString()
    };
    
    const metadataFile = new File(
      [JSON.stringify(metadata, null, 2)],
      'metadata.json',
      { type: 'application/json' }
    );
    
    // Upload metadata to IPFS
    const metadataCid = await client.put([metadataFile]);
    
    res.status(200).json({
      success: true,
      contentCid: cid,
      metadataCid: metadataCid,
      ipfsUrl: `ipfs://${cid}`
    });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    res.status(500).json({ error: 'Failed to upload content' });
  }
});

// AI-assisted content generation
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, type } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    let systemPrompt = '';
    
    if (type === 'module') {
      systemPrompt = 'You are an expert blockchain educator. Create a detailed learning module outline based on the user\'s request.';
    } else if (type === 'quiz') {
      systemPrompt = 'You are an expert blockchain educator. Create a quiz with 5 multiple-choice questions based on the user\'s topic.';
    } else if (type === 'explanation') {
      systemPrompt = 'You are an expert blockchain educator. Provide a clear, concise explanation of the concept the user is asking about.';
    } else {
      systemPrompt = 'You are an expert blockchain educator. Help the user with their blockchain learning needs.';
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000
    });
    
    res.status(200).json({
      success: true,
      content: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeContracts();
});

module.exports = app;