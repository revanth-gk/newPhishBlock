# PhishBlock Deployment Guide

## Prerequisites

Before deploying PhishBlock, ensure you have the following:

1. Node.js 18+ installed
2. npm or yarn package manager
3. Ethereum wallet with testnet ETH (Sepolia recommended)
4. API keys for:
   - Alchemy or Infura for Ethereum RPC
   - WalletConnect for wallet connections
   - Supabase for database
   - Web3.Storage for IPFS storage

## Smart Contract Deployment

### 1. Environment Setup

Create a `.env` file in the `smart-contracts` directory:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

### 2. Install Dependencies

```bash
cd smart-contracts
npm install
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm run test
```

### 5. Deploy to Sepolia Testnet

```bash
npm run deploy:sepolia
```

### 6. Verify Contracts on Etherscan

```bash
npm run verify DEPLOYED_CONTRACT_ADDRESS
```

## Frontend Deployment

### 1. Environment Setup

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=YOUR_WEB3_STORAGE_TOKEN
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel deploy
   ```

### 6. Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Database Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Get your project URL and anon key from the project settings

### 2. Create Database Tables

Run the following SQL in the Supabase SQL editor:

```sql
-- Create reports table
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

-- Create validators table
CREATE TABLE validators (
  address TEXT PRIMARY KEY,
  reputation_score INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reports_target ON reports(target);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);
```

### 3. Enable Row Level Security (RLS)

```sql
-- Enable RLS on reports table
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Enable RLS on validators table
ALTER TABLE validators ENABLE ROW LEVEL SECURITY;
```

## Security Considerations

### Smart Contract Security

1. **Access Controls**: Only admins can add/remove validators
2. **Rate Limiting**: Implement rate limiting for report submissions
3. **Reentrancy Guards**: Use reentrancy guards for sensitive functions
4. **Emergency Pause**: Implement emergency pause functionality

### Frontend Security

1. **Input Validation**: Validate all user inputs
2. **Sanitization**: Sanitize data before IPFS storage
3. **CSRF Protection**: Implement CSRF protection
4. **HTTP Headers**: Use secure HTTP headers

### Database Security

1. **RLS**: Enable Row Level Security in Supabase
2. **Authentication**: Implement proper API authentication
3. **Environment Variables**: Use environment variables for sensitive data
4. **Regular Audits**: Conduct regular security audits

## Monitoring and Maintenance

### Smart Contracts

1. Monitor contract events using The Graph or similar indexing services
2. Set up alerts for critical contract functions
3. Regularly audit contract code for vulnerabilities

### Frontend

1. Monitor application performance using tools like Sentry
2. Set up error tracking and logging
3. Regularly update dependencies to patch security vulnerabilities

### Database

1. Monitor database performance and query times
2. Set up backups for critical data
3. Regularly review and optimize database queries

## Troubleshooting

### Common Issues

1. **Deployment Failures**: Check RPC endpoint and private key
2. **Wallet Connection Issues**: Verify WalletConnect project ID
3. **IPFS Upload Failures**: Check Web3.Storage token
4. **Database Connection Issues**: Verify Supabase credentials

### Getting Help

1. Check the [Hardhat documentation](https://hardhat.org/docs)
2. Check the [Next.js documentation](https://nextjs.org/docs)
3. Join the PhishBlock community on Discord
4. File issues on the GitHub repository