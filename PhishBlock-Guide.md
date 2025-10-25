# PhishBlock Development Guide
## A Decentralized Community-Driven Phishing Detection Platform

---

## Overview

PhishBlock is a decentralized database system for community-reported phishing URLs and scam wallet addresses. The platform leverages blockchain technology, IPFS for distributed storage, and community consensus to maintain a reliable database of malicious activities while ensuring transparency and tamper-resistance.

## System Architecture

The PhishBlock platform consists of several interconnected components:

### Core Components
- **Web3 Frontend** (Next.js + React + MetaMask integration)
- **Smart Contracts** (Solidity for Ethereum)
- **IPFS Storage** (Decentralized file storage)
- **Community Voting System** (Blockchain-based consensus)
- **Database Layer** (Supabase for off-chain data)
- **Public API** (Query interface)

---

## Technology Stack

### Frontend Development
- **Next.js 14+** - React framework with SSR/SSG capabilities
- **React 18+** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Wagmi** - React hooks for Ethereum interaction
- **ConnectKit** - Wallet connection UI components

### Blockchain & Web3
- **Ethereum** - Primary blockchain network
- **Solidity ^0.8.19** - Smart contract programming language
- **Hardhat** - Ethereum development environment
- **MetaMask** - Web3 wallet for user authentication
- **Ethers.js** - Ethereum JavaScript library

### Storage & Database
- **IPFS** - Decentralized file storage protocol
- **Supabase** - PostgreSQL database with real-time capabilities
- **Web3.Storage** - IPFS pinning service

### Development Tools
- **Hardhat** - Smart contract compilation and deployment
- **Remix IDE** - Browser-based Solidity development
- **Etherscan** - Ethereum blockchain explorer
- **Ganache** - Local blockchain for testing

---

## Implementation Guide

### Phase 1: Project Setup and Infrastructure

#### 1.1 Initialize Next.js Project
```bash
npx create-next-app@latest phishblock --typescript --tailwind --eslint
cd phishblock
npm install wagmi viem @rainbow-me/rainbowkit connectkit
```

#### 1.2 Set up Hardhat for Smart Contract Development
```bash
mkdir smart-contracts && cd smart-contracts
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

#### 1.3 Configure Environment Variables
```env
# .env.local
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
WEB3_STORAGE_TOKEN=your_web3_storage_token
```

### Phase 2: Smart Contract Development

#### 2.1 PhishBlock Core Contract
```solidity
// contracts/PhishBlock.sol
pragma solidity ^0.8.19;

contract PhishBlock {
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
    
    enum ReportStatus { PENDING, VALIDATED, REJECTED, DISPUTED }
    
    mapping(uint256 => Report) public reports;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => bool) public validators;
    
    uint256 public reportCount;
    uint256 public constant VALIDATION_THRESHOLD = 3;
    uint256 public constant VOTING_PERIOD = 7 days;
    
    event ReportSubmitted(uint256 indexed reportId, address indexed reporter, string target);
    event VoteCast(uint256 indexed reportId, address indexed voter, bool support);
    event ReportValidated(uint256 indexed reportId, ReportStatus status);
    
    modifier onlyValidator() {
        require(validators[msg.sender], "Not a validator");
        _;
    }
    
    function submitReport(
        string memory _reportType,
        string memory _target,
        string memory _ipfsHash
    ) external returns (uint256) {
        reportCount++;
        
        reports[reportCount] = Report({
            id: reportCount,
            reporter: msg.sender,
            reportType: _reportType,
            target: _target,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            status: ReportStatus.PENDING,
            votesFor: 0,
            votesAgainst: 0
        });
        
        emit ReportSubmitted(reportCount, msg.sender, _target);
        return reportCount;
    }
    
    function vote(uint256 _reportId, bool _support) external onlyValidator {
        require(_reportId <= reportCount, "Invalid report ID");
        require(!hasVoted[_reportId][msg.sender], "Already voted");
        require(reports[_reportId].status == ReportStatus.PENDING, "Voting closed");
        
        hasVoted[_reportId][msg.sender] = true;
        
        if (_support) {
            reports[_reportId].votesFor++;
        } else {
            reports[_reportId].votesAgainst++;
        }
        
        emit VoteCast(_reportId, msg.sender, _support);
        
        // Check if validation threshold is met
        if (reports[_reportId].votesFor >= VALIDATION_THRESHOLD) {
            reports[_reportId].status = ReportStatus.VALIDATED;
            emit ReportValidated(_reportId, ReportStatus.VALIDATED);
        } else if (reports[_reportId].votesAgainst >= VALIDATION_THRESHOLD) {
            reports[_reportId].status = ReportStatus.REJECTED;
            emit ReportValidated(_reportId, ReportStatus.REJECTED);
        }
    }
    
    function addValidator(address _validator) external {
        // Add access control logic here
        validators[_validator] = true;
    }
    
    function getReport(uint256 _reportId) external view returns (Report memory) {
        require(_reportId <= reportCount, "Invalid report ID");
        return reports[_reportId];
    }
}
```

#### 2.2 Deploy Smart Contract
```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const PhishBlock = await hre.ethers.getContractFactory("PhishBlock");
    const phishBlock = await PhishBlock.deploy();
    
    await phishBlock.deployed();
    
    console.log("PhishBlock deployed to:", phishBlock.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

### Phase 3: Frontend Development

#### 3.1 Web3 Provider Setup
```tsx
// providers/Web3Provider.tsx
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    publicProvider(),
  ]
);

const config = getDefaultConfig({
  appName: "PhishBlock",
  chains,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
```

#### 3.2 MetaMask Authentication Component
```tsx
// components/ConnectWallet.tsx
import { ConnectKitButton } from 'connectkit';
import { useAccount, useDisconnect } from 'wagmi';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex items-center gap-4">
      <ConnectKitButton />
      {isConnected && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <button
            onClick={() => disconnect()}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
```

#### 3.3 Report Submission Form
```tsx
// components/ReportForm.tsx
import { useState } from 'react';
import { useContractWrite, useAccount } from 'wagmi';
import { Web3Storage } from 'web3.storage';

const PHISHBLOCK_CONTRACT = {
  address: '0x...', // Your deployed contract address
  abi: [...], // Your contract ABI
};

export function ReportForm() {
  const [reportType, setReportType] = useState<'URL' | 'WALLET'>('URL');
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState('');
  
  const { address } = useAccount();
  const { write: submitReport, isLoading } = useContractWrite({
    ...PHISHBLOCK_CONTRACT,
    functionName: 'submitReport',
  });

  const uploadToIPFS = async (data: any) => {
    const client = new Web3Storage({ 
      token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN! 
    });
    
    const file = new File([JSON.stringify(data)], 'report.json', {
      type: 'application/json',
    });
    
    const cid = await client.put([file]);
    return cid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    try {
      // Upload detailed report to IPFS
      const reportData = {
        reportType,
        target,
        description,
        evidence,
        reporter: address,
        timestamp: Date.now(),
      };
      
      const ipfsHash = await uploadToIPFS(reportData);
      
      // Submit to smart contract
      submitReport({
        args: [reportType, target, ipfsHash],
      });
      
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Report Type
        </label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as 'URL' | 'WALLET')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="URL">Phishing URL</option>
          <option value="WALLET">Scam Wallet</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {reportType === 'URL' ? 'Malicious URL' : 'Scam Wallet Address'}
        </label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={reportType === 'URL' ? 'https://...' : '0x...'}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Describe the phishing attempt or scam..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Evidence (optional)
        </label>
        <textarea
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Any additional evidence or proof..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}
```

### Phase 4: Community Voting System

#### 4.1 Voting Interface
```tsx
// components/VotingInterface.tsx
import { useContractRead, useContractWrite } from 'wagmi';
import { useState, useEffect } from 'react';

export function VotingInterface({ reportId }: { reportId: number }) {
  const [report, setReport] = useState<any>(null);
  
  const { data: reportData } = useContractRead({
    ...PHISHBLOCK_CONTRACT,
    functionName: 'getReport',
    args: [reportId],
  });

  const { write: vote } = useContractWrite({
    ...PHISHBLOCK_CONTRACT,
    functionName: 'vote',
  });

  const handleVote = (support: boolean) => {
    vote({
      args: [reportId, support],
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {reportData && (
        <>
          <div>
            <h3 className="font-semibold">Report #{reportId}</h3>
            <p className="text-sm text-gray-600">
              Type: {reportData.reportType} | Target: {reportData.target}
            </p>
            <p className="text-sm text-gray-600">
              Status: {reportData.status} | 
              Votes For: {reportData.votesFor.toString()} | 
              Votes Against: {reportData.votesAgainst.toString()}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleVote(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Vote Valid
            </button>
            <button
              onClick={() => handleVote(false)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Vote Invalid
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

### Phase 5: Database Integration

#### 5.1 Supabase Setup
```sql
-- Create tables in Supabase
CREATE TABLE reports (
  id BIGINT PRIMARY KEY,
  reporter_address TEXT NOT NULL,
  report_type TEXT NOT NULL,
  target TEXT NOT NULL,
  ipfs_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE validators (
  address TEXT PRIMARY KEY,
  reputation_score INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reports_target ON reports(target);
CREATE INDEX idx_reports_status ON reports(status);
```

#### 5.2 Database Service
```typescript
// lib/database.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export class DatabaseService {
  static async syncReport(reportData: any) {
    const { data, error } = await supabase
      .from('reports')
      .upsert({
        id: reportData.id,
        reporter_address: reportData.reporter,
        report_type: reportData.reportType,
        target: reportData.target,
        ipfs_hash: reportData.ipfsHash,
        status: reportData.status,
        votes_for: reportData.votesFor,
        votes_against: reportData.votesAgainst,
      });
    
    if (error) throw error;
    return data;
  }

  static async checkTarget(target: string) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('target', target)
      .eq('status', 'VALIDATED');
    
    if (error) throw error;
    return data;
  }
}
```

### Phase 6: Public API

#### 6.1 Query API
```typescript
// pages/api/check/[target].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { DatabaseService } from '../../../lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { target } = req.query;

  try {
    const reports = await DatabaseService.checkTarget(target as string);
    
    res.status(200).json({
      isMalicious: reports.length > 0,
      reports: reports,
      confidence: reports.length > 0 ? 'high' : 'none',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

---

## Deployment Guide

### Smart Contract Deployment

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract on Etherscan
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Frontend Deployment

```bash
# Build the application
npm run build

# Deploy to Vercel
vercel deploy

# Or deploy to Netlify
netlify deploy --prod
```

---

## Security Considerations

### Smart Contract Security
- Implement access controls for validator management
- Add rate limiting for report submissions
- Use reentrancy guards for sensitive functions
- Implement emergency pause functionality

### Frontend Security
- Validate all user inputs
- Sanitize data before IPFS storage
- Implement CSRF protection
- Use secure HTTP headers

### Database Security
- Enable Row Level Security (RLS) in Supabase
- Implement proper API authentication
- Use environment variables for sensitive data
- Regular security audits

---

## Testing Strategy

### Unit Tests
```javascript
// test/PhishBlock.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PhishBlock", function () {
  let phishBlock;
  let owner;
  let validator;
  let reporter;

  beforeEach(async function () {
    [owner, validator, reporter] = await ethers.getSigners();
    
    const PhishBlock = await ethers.getContractFactory("PhishBlock");
    phishBlock = await PhishBlock.deploy();
    await phishBlock.deployed();
    
    // Add validator
    await phishBlock.addValidator(validator.address);
  });

  it("Should submit a report", async function () {
    const tx = await phishBlock.connect(reporter).submitReport(
      "URL",
      "https://malicious-site.com",
      "QmHash123"
    );
    
    expect(tx).to.emit(phishBlock, "ReportSubmitted");
  });

  it("Should allow voting by validators", async function () {
    await phishBlock.connect(reporter).submitReport(
      "URL",
      "https://malicious-site.com",
      "QmHash123"
    );
    
    const tx = await phishBlock.connect(validator).vote(1, true);
    expect(tx).to.emit(phishBlock, "VoteCast");
  });
});
```

---

## Future Enhancements

### Advanced Features
- Machine learning integration for automatic threat detection
- Reputation system for validators
- Economic incentives (token rewards)
- Cross-chain compatibility
- Mobile application development

### Scalability Solutions
- Layer 2 integration (Polygon, Arbitrum)
- IPFS cluster for better performance
- CDN integration for faster queries
- Caching mechanisms

---

## Contributing Guidelines

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit pull request with detailed description

### Code Standards
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write comprehensive documentation
- Include unit tests for all functions

---

## Support and Resources

### Documentation
- [Ethereum Documentation](https://ethereum.org/developers)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [IPFS Documentation](https://docs.ipfs.io)

### Community
- Discord: [PhishBlock Community]
- GitHub: [PhishBlock Repository]
- Twitter: [@PhishBlock]

---

This comprehensive guide provides the foundation for building PhishBlock as a decentralized, community-driven phishing detection platform. The modular architecture allows for iterative development and future enhancements while maintaining security and decentralization principles.