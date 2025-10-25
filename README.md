# PhishBlock

A decentralized, community-driven phishing detection platform built on Ethereum blockchain with IPFS storage and Supabase database.

## Overview

PhishBlock is a decentralized database system for community-reported phishing URLs and scam wallet addresses. The platform leverages blockchain technology, IPFS for distributed storage, and community consensus to maintain a reliable database of malicious activities while ensuring transparency and tamper-resistance.

## Features

- **Decentralized**: Smart contracts on Ethereum blockchain
- **Community-Driven**: Voting system with validator roles
- **Shared Database**: Public API for querying reports
- **Web3 Authentication**: Complete MetaMask authentication flow
- **IPFS Storage**: Decentralized storage for detailed report data
- **Responsive Design**: Mobile-friendly interface
- **Enhanced Security**: Multiple security measures implemented

## Technology Stack

### Frontend
- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Wagmi for Ethereum interaction
- RainbowKit for wallet connection
- Web3.Storage for IPFS integration
- Supabase for database integration

### Smart Contracts
- Solidity ^0.8.19
- Hardhat development environment
- Ethereum blockchain

### Storage & Database
- IPFS (Web3.Storage)
- Supabase (PostgreSQL)

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
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask wallet

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd newPhishBlock
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install smart contract dependencies:
   ```bash
   cd ../smart-contracts
   npm install
   ```

### Running the Application

1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Visit `http://localhost:3000` in your browser

### Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token
```

## Smart Contract Development

### Compiling Contracts

```bash
cd smart-contracts
npx hardhat compile
```

### Running Tests

```bash
cd smart-contracts
npx hardhat test
```

### Deploying Contracts

```bash
cd smart-contracts
npx hardhat run scripts/deploy.js --network sepolia
```

## Security Features

### Smart Contract Security
- Emergency pause functionality
- Input validation for report types, targets, and IPFS hashes
- Access controls for validators and admins
- Reentrancy protection through function modifiers

### Frontend Security
- Client-side input validation
- Rate limiting on API endpoints
- XSS protection through input sanitization
- Secure HTTP headers

### Database Security
- Row Level Security (RLS) policies
- Data sanitization
- Rate limiting on queries

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Ethereum Foundation
- IPFS Community
- Supabase Team
- Next.js Team