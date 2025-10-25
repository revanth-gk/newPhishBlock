# PhishBlock Deployment Guide

This guide will help you deploy the PhishBlock application to various hosting platforms.

## Prerequisites

1. Node.js 18+
2. npm or yarn
3. Git
4. A hosting account (Vercel, Netlify, etc.)

## Environment Variables

Before deploying, you'll need to set up the following environment variables:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

For hackathon demos, you can use placeholder values for optional variables:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=placeholder_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=placeholder_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_supabase_anon_key
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=placeholder_web3_storage_token
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

## Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Sign up at [vercel.com](https://vercel.com)
3. Create a new project and import your repository
4. Set the root directory to `frontend`
5. Add the environment variables in the Vercel dashboard
6. Deploy!

### Netlify

1. Build the project locally:
   ```bash
   cd frontend
   npm run build
   ```
2. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Deploy:
   ```bash
   netlify deploy
   ```

### Traditional Hosting

1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```
2. The built files will be in the `frontend/.next` directory
3. Upload these files to your hosting provider

## Smart Contract Deployment

To deploy the smart contracts to a testnet or mainnet:

1. Add your private key to the `.env` file in the `smart-contracts` directory:
   ```env
   PRIVATE_KEY=your_private_key
   ```
2. Configure the network in `hardhat.config.js`
3. Run the deployment script:
   ```bash
   cd smart-contracts
   npx hardhat run scripts/deploy.js --network network_name
   ```

## Post-Deployment

After deployment, make sure to:

1. Update the `NEXT_PUBLIC_CONTRACT_ADDRESS` environment variable with the deployed contract address
2. Test all functionality including wallet connection and report submission
3. Verify that the IPFS integration works correctly

## Troubleshooting

### Build Issues

If you encounter build issues, try:

1. Clearing the build cache:
   ```bash
   cd frontend
   rm -rf .next
   npm run build
   ```

2. Checking Node.js version compatibility

### Runtime Issues

If the application doesn't work after deployment:

1. Verify all environment variables are set correctly
2. Check browser console for errors
3. Ensure the smart contract is deployed and the address is correct

## Support

For additional help, refer to the main README.md file or contact the PhishBlock team.
