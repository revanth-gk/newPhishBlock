# PhishBlock Complete Guide

A decentralized, community-driven phishing detection platform built on Ethereum blockchain with IPFS storage and Supabase database.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [System Architecture](#system-architecture)
6. [Core Components](#core-components)
7. [Development Plan](#development-plan)
8. [Technical Specification](#technical-specification)
9. [Deployment Guide](#deployment-guide)
10. [Testing Strategy](#testing-strategy)
11. [Security Checklist](#security-checklist)

## Project Overview

PhishBlock is a decentralized database system for community-reported phishing URLs and scam wallet addresses. The platform leverages blockchain technology, IPFS for distributed storage, and community consensus to maintain a reliable database of malicious activities while ensuring transparency and tamper-resistance.

## Key Features

### ✅ Decentralized Architecture
- Smart contracts deployed on Ethereum blockchain
- IPFS storage for decentralized data persistence
- No central authority controlling the platform

### ✅ Community-Driven Validation
- Voting system with validator roles
- Community consensus for report validation
- Reputation system for trusted validators

### ✅ Shared Database
- Public API for querying reports
- Real-time database updates via Supabase
- Open access to verified malicious entities

### ✅ Web3 Authentication
- Complete MetaMask authentication flow
- Wallet connection via RainbowKit
- User identity tied to Ethereum address

### ✅ Production-Ready Design
- Error handling for all user interactions
- Loading states for async operations
- Mobile-responsive design
- Comprehensive testing suite

## Technology Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wagmi** and **RainbowKit** for Web3 integration
- **Web3.Storage** for IPFS integration
- **Supabase** for database integration

### Smart Contracts
- **Solidity ^0.8.19**
- **Hardhat** development environment
- **Ethers.js** for contract interaction

### Storage & Database
- **IPFS** via Web3.Storage
- **Supabase** (PostgreSQL with real-time capabilities)

## Project Structure

```
newPhishBlock/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries
│   │   ├── providers/        # Context providers
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   └── ...
├── smart-contracts/          # Solidity smart contracts
│   ├── contracts/            # Solidity contracts
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Contract tests
│   └── ...
├── database/                 # Database schema and migrations
└── ...
```

## System Architecture

### Core Components

1. **Web3 Frontend** (Next.js + React + MetaMask integration)
2. **Smart Contracts** (Solidity for Ethereum)
3. **IPFS Storage** (Decentralized file storage)
4. **Community Voting System** (Blockchain-based consensus)
5. **Database Layer** (Supabase for off-chain data)
6. **Public API** (Query interface)

## Core Components

### Smart Contracts
- **PhishBlock.sol**: Main contract with report management and voting system
- **Events**: ReportSubmitted, VoteCast, ReportValidated, ValidatorAdded/Removed
- **Access Control**: Admin and validator roles with modifiers
- **Core Functions**: submitReport, vote, addValidator, removeValidator, getReport

### Frontend Pages
1. **Dashboard** - Overview with statistics and quick actions
2. **Submit Report** - Form for submitting new phishing reports
3. **Validate Reports** - Interface for community voting
4. **All Reports** - Browse all reports with filtering
5. **Report Details** - Detailed view of individual reports
6. **Quick Check** - Simple verification interface
7. **Profile** - User profile with voting history

### Reusable Components
- **Web3Provider** - Wagmi and RainbowKit provider wrapper
- **ConnectWallet** - MetaMask wallet connection
- **ReportForm** - Report submission form
- **ReportList** - Report listing component
- **ReportDetails** - Detailed report view
- **VotingInterface** - Voting interface
- **QuickCheck** - Quick verification component
- **UserVotes** - User voting history
- **NavBar** - Navigation component
- **Dashboard** - Main dashboard

### Custom Hooks
- **usePhishBlock** - Hook for smart contract interaction
- **useWalletAuth** - Hook for wallet authentication

## Development Plan

### Phase 1: Foundation (Weeks 1-2)
- Set up development environment
- Create project structure
- Implement basic smart contracts
- Build core frontend components

### Phase 2: Core Functionality (Weeks 3-4)
- Implement voting system
- Add validator management
- Create comprehensive frontend
- Develop database integration

### Phase 3: Integration & Testing (Weeks 5-6)
- Integrate all components
- Implement IPFS storage
- Create API routes
- Conduct comprehensive testing

### Phase 4: Production Ready (Weeks 7-8)
- Finalize deployment configurations
- Optimize performance
- Complete documentation
- Prepare for mainnet deployment

## Technical Specification

### Smart Contract Layer

#### Report Struct
```solidity
struct Report {
    uint256 id;
    address reporter;
    string reportType; // "URL" or "WALLET"
    string target; // The malicious URL or wallet address
    string ipfsHash; // IPFS hash of detailed report data
    uint256 timestamp;
    ReportStatus status;
    uint256 votesFor;
    uint256 votesAgainst;
}
```

#### Enums and Mappings
```solidity
enum ReportStatus { PENDING, VALIDATED, REJECTED, DISPUTED }

mapping(uint256 => Report) public reports;
mapping(uint256 => mapping(address => bool)) public hasVoted;
mapping(address => bool) public validators;
mapping(address => bool) public admin;
```

#### Core Functions
- **submitReport**: Allows users to submit new phishing reports
- **vote**: Enables validators to vote on the validity of reports
- **addValidator / removeValidator**: Admin functions to manage validator permissions
- **getReport**: Public function to retrieve report details
- **getReportsByStatus**: Function to retrieve reports filtered by status

## Deployment Guide

### Prerequisites
1. Node.js 18+ installed
2. npm or yarn package manager
3. Ethereum wallet with testnet ETH (Sepolia recommended)
4. API keys for:
   - Alchemy or Infura for Ethereum RPC
   - WalletConnect for wallet connections
   - Supabase for database
   - Web3.Storage for IPFS storage

### Smart Contract Deployment
1. Create a `.env` file in the `smart-contracts` directory
2. Install dependencies: `npm install`
3. Compile contracts: `npm run compile`
4. Run tests: `npm run test`
5. Deploy to Sepolia Testnet: `npm run deploy:sepolia`
6. Verify Contracts on Etherscan: `npm run verify DEPLOYED_CONTRACT_ADDRESS`

### Frontend Deployment
1. Create a `.env.local` file in the `frontend` directory
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Build for production: `npm run build`
5. Deploy to Vercel or Netlify

### Database Setup
1. Create Supabase Project
2. Create database tables with proper indexes
3. Enable Row Level Security (RLS)

## Testing Strategy

### Testing Layers
1. **Unit Testing**: Smart contracts, frontend components, utility functions
2. **Integration Testing**: Smart contract integration, frontend integration, database integration
3. **End-to-End Testing**: User flows, authentication flows, error handling
4. **Security Testing**: Smart contract security, frontend security, API security
5. **Performance Testing**: Load testing, stress testing
6. **Compatibility Testing**: Browser compatibility, device testing

### Testing Tools
- **Smart Contracts**: Hardhat, Chai, Mocha, Waffle
- **Frontend**: Jest, React Testing Library, Cypress, Puppeteer
- **Security**: Slither, Mythril, OWASP ZAP, Burp Suite
- **Performance**: Artillery, k6, Lighthouse, Gatling

## Security Checklist

### Smart Contract Security
- [ ] Only admins can add/remove validators
- [ ] Only validators can vote on reports
- [ ] Proper role-based access control implemented
- [ ] Emergency pause functionality available
- [ ] Validate report types (URL/WALLET only)
- [ ] Validate target addresses/URLs
- [ ] Validate IPFS hashes
- [ ] Check for empty or malicious inputs
- [ ] Use reentrancy guards for all state-changing functions
- [ ] Follow checks-effects-interactions pattern
- [ ] Avoid external calls in sensitive functions

### Frontend Security
- [ ] Secure wallet connection implementation
- [ ] Proper session management
- [ ] Protection against session hijacking
- [ ] Secure handling of wallet signatures
- [ ] Client-side validation of user inputs
- [ ] Server-side validation of all data
- [ ] Sanitization of data before storage
- [ ] Protection against XSS attacks

### Database Security
- [ ] Row Level Security (RLS) enabled
- [ ] Proper role-based access controls
- [ ] Secure API keys and credentials
- [ ] Principle of least privilege applied
- [ ] Encryption of sensitive data at rest
- [ ] Secure transmission of data in transit

### Network Security
- [ ] HTTPS enforced for all connections
- [ ] Secure WebSocket connections
- [ ] Certificate pinning where appropriate
- [ ] Content Security Policy (CSP) implemented

### IPFS Security
- [ ] Validation of IPFS content before pinning
- [ ] Content-type checking for uploaded files
- [ ] Size limits for uploaded content
- [ ] Malware scanning for binary content

### Monitoring and Incident Response
- [ ] Comprehensive logging of all critical events
- [ ] Secure storage of logs
- [ ] Regular log analysis
- [ ] Alerting for suspicious activity
- [ ] Incident response plan documented
- [ ] Regular security training for team members

This comprehensive guide provides all the information needed to understand, develop, deploy, and maintain the PhishBlock platform. The modular architecture allows for iterative development and future enhancements while maintaining security and decentralization principles.