# DAIverse - Decentralized AI-Powered Knowledge & Skillverse

## Overview

DAIverse is a revolutionary decentralized Web3 platform that combines blockchain technology with artificial intelligence to create a dynamic learning ecosystem. The platform enables experts to share knowledge through micro-courses, allows learners to complete challenges and earn rewards, and leverages AI to generate personalized content and learning paths.

All contributions, reviews, and achievements are transparently stored on the blockchain, creating a trustless environment where users can earn tokens and NFT badges for their participation and accomplishments.

## Core Features

- **Learn & Earn**: Complete courses and challenges to earn tokens and NFT badges that prove your skills
- **AI-Powered Learning**: Our AI generates personalized content, explains code, and recommends learning paths tailored to you
- **Share Knowledge**: Create and publish your own courses or code modules and earn rewards when others learn from them
- **On-Chain Verification**: All contributions and achievements are recorded on the blockchain, ensuring transparency and ownership
- **Prediction Markets**: Participate in decentralized prediction markets to forecast events and earn rewards for accurate predictions

## Tech Stack

### Frontend
- **React**: Component-based UI library for building the user interface
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Ethers.js**: Library for interacting with the Ethereum blockchain
- **Vite**: Next-generation frontend build tool for faster development
- **Spheron**: Decentralized hosting platform for IPFS deployment

### Smart Contracts
- **Solidity**: Programming language for Ethereum smart contracts
- **Hardhat**: Development environment for compiling, deploying, and testing
- **OpenZeppelin**: Library for secure smart contract development
- **ERC-20**: Token standard for DAIverse utility tokens
- **ERC-721**: NFT standard for skill badges and achievements

### Backend
- **Node.js + Express**: Server-side JavaScript runtime and web framework
- **Heurist AI**: Integration for AI-powered content generation and personalization
- **IPFS via Spheron**: Decentralized storage for course content and user contributions

## Project Structure

```
daiverse/
├── client/                 # Frontend React application
│   ├── src/                # Source code
│   │   ├── assets/         # Static assets (images, icons)
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers (Web3, Auth)
│   │   ├── layouts/        # Page layout components
│   │   ├── pages/          # Main application pages
│   │   └── styles/         # Global styles and theme
├── contracts/              # Solidity smart contracts
│   ├── interfaces/         # Contract interfaces
│   └── mocks/              # Mock contracts for testing
├── server/                 # Node.js + Express backend
│   └── routes/             # API route handlers
├── scripts/                # Deployment and utility scripts
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v16+) and npm
- MetaMask wallet or compatible Web3 wallet
- Hardhat for smart contract development
- Git for version control

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/daiverse.git
   cd daiverse
   ```

2. Install root dependencies
   ```bash
   npm install
   ```

3. Install dependencies for each component:
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend
   cd ../server
   npm install
   ```

4. Configure environment variables
   - Copy `.env.example` to `.env` in the root directory
   - Update the variables with your specific configuration
   - Required variables include API keys for Heurist AI and blockchain network details

5. Compile and deploy smart contracts
   ```bash
   npm run compile
   npm run deploy
   ```

6. Start the development environment
   ```bash
   npm run dev
   ```
   This will concurrently start the Hardhat node, deploy contracts, and launch the frontend.

## Features Implementation

### Frontend Pages
- **Landing Page**: Introduction to DAIverse with key features and benefits
- **Dashboard**: User's learning progress, rewards, and personalized recommendations
- **Learn Page**: Browse and interact with learning modules, complete challenges
- **Contribute Page**: Submit tutorials, code examples, or create new learning modules
- **Profile Page**: Display NFT badges, completed modules, and reputation score
- **Prediction Markets**: Interface for creating and participating in knowledge prediction markets

### Smart Contracts
- **DAIToken.sol**: ERC-20 implementation for platform utility tokens
- **DAIBadge.sol**: ERC-721 implementation for skill verification NFTs
- **DAIModule.sol**: Learning module management and progress tracking
- **DAIPredictionMarket.sol**: Decentralized prediction market implementation
- **User progress tracking**: On-chain verification of completed modules
- **Reputation scoring**: Algorithmic calculation of user expertise and contributions
- **Community voting**: Decentralized content verification and quality assurance

### AI Integration
- **Auto-generated quiz questions**: AI creates relevant assessment questions based on content
- **Code explanation**: AI breaks down complex code into simple, understandable terms
- **Personalized learning recommendations**: AI suggests modules based on user progress and goals
- **Content generation assistance**: AI helps creators develop high-quality learning materials
- **Research assistant**: AI-powered tool for finding relevant information and resources

### Gamification
- **NFT badges**: Verifiable proof of skills and achievements
- **XP and token reward system**: Economic incentives for platform participation
- **User ranking**: Competitive leaderboards based on contributions and achievements
- **Learning streaks**: Incentives for consistent platform engagement
- **Achievement system**: Unlockable milestones for various platform activities

## Deployment

### Local Development
- Run `npm run dev` to start the local development environment
- Access the frontend at `http://localhost:3000`
- The Hardhat node will be running at `http://localhost:8545`

### Testnet Deployment
1. Configure the appropriate network in `hardhat.config.js`
2. Set the correct environment variables for the testnet
3. Run `npx hardhat run scripts/deploy.js --network <testnet-name>`
4. Deploy the frontend to Spheron or other hosting service

### Production Deployment
1. Configure production environment variables
2. Deploy smart contracts to mainnet
3. Build the frontend with `cd client && npm run build`
4. Deploy the built frontend to production hosting

## Contributing

We welcome contributions to DAIverse! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.