import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TradesPage from './TradesPage';
import * as api from '../services/api';

vi.mock('../services/api');

describe('TradesPage', () => {
  it('renders loading state initially', () => {
    vi.spyOn(api, 'getUserTrades').mockResolvedValue([]);
    localStorage.setItem('token', 'test-token');
    render(<TradesPage />);
    expect(screen.getByText('Loading trades...')).toBeInTheDocument();
  });

  it('renders trades after successful fetch', async () => {
    const mockTrades = [
      { id: 1, symbol: 'AAPL', direction: 'buy', size: 10, entryPrice: 150, createdAt: new Date().toISOString() },
      { id: 2, symbol: 'GOOG', direction: 'sell', size: 5, entryPrice: 2800, createdAt: new Date().toISOString() },
    ];
    vi.spyOn(api, 'getUserTrades').mockResolvedValue(mockTrades);
    localStorage.setItem('token', 'test-token');

    render(<TradesPage />);

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('GOOG')).toBeInTheDocument();
    });
  });

  it('renders error message on fetch failure', async () => {
    vi.spyOn(api, 'getUserTrades').mockRejectedValue(new Error('Failed to fetch trades.'));
    localStorage.setItem('token', 'test-token');
    render(<TradesPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch trades.')).toBeInTheDocument();
    });
  });

  it('renders error message if no token is found', () => {
    localStorage.removeItem('token');
    render(<TradesPage />);
    expect(screen.getByText('No authentication token found. Please log in.')).toBeInTheDocument();
  });
});
