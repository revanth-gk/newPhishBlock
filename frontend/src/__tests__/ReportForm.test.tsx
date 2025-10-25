import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReportForm } from '../components/ReportForm';

// Mock the useAccount hook
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  }),
}));

// Mock IPFS client
jest.mock('../lib/ipfs', () => ({
  getIPFSClient: jest.fn().mockImplementation(() => ({
    uploadJSON: jest.fn().mockResolvedValue('QmMockCID1234567890'),
  })),
}));

describe('ReportForm', () => {
  it('renders correctly', () => {
    render(<ReportForm />);
    
    expect(screen.getByText('Report Type')).toBeInTheDocument();
    expect(screen.getByText('Malicious URL')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Evidence (optional)')).toBeInTheDocument();
    expect(screen.getByText('Submit Report')).toBeInTheDocument();
  });

  it('allows user to fill out form', () => {
    render(<ReportForm />);
    
    const urlInput = screen.getByPlaceholderText('https://...');
    fireEvent.change(urlInput, { target: { value: 'https://fake-site.com' } });
    expect(urlInput).toHaveValue('https://fake-site.com');
    
    const descriptionInput = screen.getByPlaceholderText('Describe the phishing attempt or scam...');
    fireEvent.change(descriptionInput, { target: { value: 'This site is trying to steal my crypto' } });
    expect(descriptionInput).toHaveValue('This site is trying to steal my crypto');
  });

  it('switches between URL and WALLET report types', () => {
    render(<ReportForm />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'WALLET' } });
    
    expect(screen.getByText('Scam Wallet Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0x...')).toBeInTheDocument();
  });
});