# PhishBlock Technical Specification

## Overview

PhishBlock is a decentralized, community-driven phishing detection platform that leverages blockchain technology, IPFS for distributed storage, and community consensus to maintain a reliable database of malicious activities while ensuring transparency and tamper-resistance.

## System Architecture

### Core Components

1. **Web3 Frontend** (Next.js + React + MetaMask integration)
2. **Smart Contracts** (Solidity for Ethereum)
3. **IPFS Storage** (Decentralized file storage)
4. **Community Voting System** (Blockchain-based consensus)
5. **Database Layer** (Supabase for off-chain data)
6. **Public API** (Query interface)

## Technology Stack

### Frontend Development
- **Next.js 14+** - React framework with App Router
- **React 18+** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Wagmi** - React hooks for Ethereum interaction
- **RainbowKit** - Wallet connection UI components
- **Web3.Storage** - IPFS pinning service
- **Supabase** - PostgreSQL database with real-time capabilities

### Blockchain & Web3
- **Ethereum** - Primary blockchain network
- **Solidity ^0.8.19** - Smart contract programming language
- **Hardhat** - Ethereum development environment
- **MetaMask** - Web3 wallet for user authentication
- **Viem** - Ethereum JavaScript library

### Storage & Database
- **IPFS** - Decentralized file storage protocol
- **Supabase** - PostgreSQL database with real-time capabilities
- **Web3.Storage** - IPFS pinning service

## Monorepo Structure

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
└── README.md
```

## Smart Contract Layer

### Contract Structure

The PhishBlock smart contract includes the following key components:

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

#### Events
```solidity
event ReportSubmitted(uint256 indexed reportId, address indexed reporter, string target);
event VoteCast(uint256 indexed reportId, address indexed voter, bool support);
event ReportValidated(uint256 indexed reportId, ReportStatus status);
event ValidatorAdded(address indexed validator);
event ValidatorRemoved(address indexed validator);
```

#### Access Control Modifiers
```solidity
modifier onlyValidator() {
    require(validators[msg.sender] || admin[msg.sender], "Not a validator");
    _;
}

modifier onlyAdmin() {
    require(admin[msg.sender], "Not an admin");
    _;
}
```

### Core Functions

#### submitReport
Allows users to submit new phishing reports with associated metadata stored on IPFS.

#### vote
Enables validators to vote on the validity of reports.

#### addValidator / removeValidator
Admin functions to manage validator permissions.

#### getReport
Public function to retrieve report details.

#### getReportsByStatus
Function to retrieve reports filtered by status.

## Frontend Application

### Main Pages

1. **Home/Dashboard** - Overview of platform statistics and quick actions
2. **Submit Report** - Form for submitting new phishing reports
3. **Validate Reports** - Interface for community voting on pending reports
4. **All Reports** - Browse all reports with filtering options
5. **Report Details** - Detailed view of individual reports
6. **Quick Check** - Simple interface to check if a URL/wallet is malicious
7. **Profile** - User profile with voting history and statistics

### Reusable Components

1. **Web3Provider** - Wagmi and RainbowKit provider wrapper
2. **ConnectWallet** - MetaMask wallet connection component
3. **ReportForm** - Form for submitting new reports
4. **ReportList** - Component for displaying lists of reports
5. **ReportDetails** - Detailed view of individual reports
6. **VotingInterface** - Interface for voting on reports
7. **QuickCheck** - Simple verification component
8. **UserVotes** - Component showing user's voting history
9. **NavBar** - Navigation component
10. **Dashboard** - Main dashboard component

### Custom Hooks

1. **usePhishBlock** - Hook for interacting with smart contract functions
2. **useWalletAuth** - Hook for wallet authentication state

## Integration Requirements

### Web3 Authentication
- MetaMask wallet integration
- WalletConnect support via RainbowKit
- User authentication state management

### IPFS Storage
- Web3.Storage integration for decentralized file storage
- JSON metadata storage for detailed report information
- File upload capabilities for evidence

### Database Integration
- Supabase integration for fast queries and real-time updates
- Off-chain data synchronization with on-chain state
- Public API for external integrations

### API Routes
- Public endpoint for checking malicious URLs/wallets
- Report submission endpoint
- Report retrieval endpoints

## Development Phases

### Phase 1: Core Functionality
- Smart contract development and testing
- Basic frontend with wallet integration
- Report submission and viewing
- Local development environment

### Phase 2: Community Features
- Voting system implementation
- Validator management
- Community reputation system
- Report validation workflow

### Phase 3: Data Integration
- IPFS storage integration
- Supabase database integration
- Public API development
- Data synchronization mechanisms

### Phase 4: Production Ready
- Security audits
- Performance optimizations
- Mobile responsiveness
- Error handling and loading states
- Documentation and deployment guides

## Success Criteria

### ✅ Wallet Connection
Users can connect their MetaMask wallet to the application

### ✅ Report Submission
Users can submit new phishing reports with all required metadata

### ✅ Community Voting
Validators can vote on pending reports to validate or reject them

### ✅ Public Database Search
Anyone can search the database to check if a URL or wallet is malicious

### ✅ Responsive Design
Application works well on desktop and mobile devices

## Technical Details

### Environment Variables
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token
```

### Testing Requirements
- Unit tests for smart contracts
- Integration tests for frontend components
- End-to-end tests for core user flows
- Security testing for smart contracts

### Security Checklist
- Smart contract access controls
- Input validation and sanitization
- Rate limiting for report submissions
- Secure storage of sensitive data
- Regular security audits

### Deployment Instructions
1. Deploy smart contracts to Ethereum testnet/mainnet
2. Configure frontend environment variables
3. Deploy frontend to Vercel/Netlify
4. Set up Supabase database
5. Configure IPFS storage

### Styling Guidelines

#### Color Scheme
- Primary: Indigo (#6366f1)
- Secondary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Background: Light gray (#f9fafb)
- Text: Dark gray (#1f2937)

#### Typography
- Primary font: Inter (via Google Fonts)
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Base font size: 16px

## Key Features Covered

### Decentralized
- Smart contracts deployed on Ethereum blockchain
- IPFS storage for decentralized data persistence
- No central authority controlling the platform

### Community-Driven
- Voting system with validator roles
- Community consensus for report validation
- Reputation system for trusted validators

### Shared Database
- Public API for querying reports
- Real-time database updates via Supabase
- Open access to verified malicious entities

### MetaMask Auth
- Complete Web3 authentication flow
- Wallet connection via RainbowKit
- User identity tied to Ethereum address

### Production-Ready
- Error handling for all user interactions
- Loading states for async operations
- Mobile-responsive design
- Comprehensive testing suite