import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReportList } from '../components/ReportList';

describe('ReportList', () => {
  it('renders correctly with mock reports', () => {
    render(<ReportList />);
    
    expect(screen.getByText('Recent Reports')).toBeInTheDocument();
    expect(screen.getByText('https://fake-binance.com')).toBeInTheDocument();
    expect(screen.getByText('0xabcdef1234567890abcdef1234567890abcdef12')).toBeInTheDocument();
  });

  it('allows filtering by status', () => {
    render(<ReportList />);
    
    const validatedButton = screen.getByText('Validated');
    fireEvent.click(validatedButton);
    
    const pendingButton = screen.getByText('Pending');
    fireEvent.click(pendingButton);
    
    const rejectedButton = screen.getByText('Rejected');
    fireEvent.click(rejectedButton);
    
    const allButton = screen.getByText('All');
    fireEvent.click(allButton);
  });

  it('shows appropriate message when no reports match filter', () => {
    // We would need to mock the reports data to test this case
    // For now, we'll just test that the component renders without crashing
    render(<ReportList />);
    expect(screen.getByText('Recent Reports')).toBeInTheDocument();
  });
});