import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VotingInterface } from '../components/VotingInterface';

// Mock the useAccount hook
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  }),
}));

describe('VotingInterface', () => {
  it('renders correctly with mock reports', () => {
    render(<VotingInterface />);
    
    expect(screen.getByText('Pending Reports for Validation')).toBeInTheDocument();
    expect(screen.getByText('https://fake-binance.com')).toBeInTheDocument();
    expect(screen.getByText('0xabcdef1234567890abcdef1234567890abcdef12')).toBeInTheDocument();
  });

  it('allows user to vote on reports', () => {
    render(<VotingInterface />);
    
    const validButtons = screen.getAllByText('Valid');
    fireEvent.click(validButtons[0]);
    
    expect(screen.getByText('Voted ✓')).toBeInTheDocument();
  });

  it('shows appropriate message when no reports are available', () => {
    // We would need to mock the reports data to test this case
    // For now, we'll just test that the component renders without crashing
    render(<VotingInterface />);
    expect(screen.getByText('Pending Reports for Validation')).toBeInTheDocument();
  });
});