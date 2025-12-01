import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CommunityPage from './CommunityPage';
import * as api from '../services/api';

vi.mock('../services/api');

describe('CommunityPage', () => {
  it('renders loading state initially', () => {
    vi.spyOn(api, 'getCommunityCategories').mockResolvedValue([]);
    render(<CommunityPage />);
    expect(screen.getByText('Loading categories...')).toBeInTheDocument();
  });

  it('renders categories after successful fetch', async () => {
    const mockCategories = [
      { id: 1, name: 'Trade Journals', description: 'Journal description', slug: 'trade-journals' },
      { id: 2, name: 'Market Discussions', description: 'Market description', slug: 'market-discussions' },
    ];
    vi.spyOn(api, 'getCommunityCategories').mockResolvedValue(mockCategories);

    render(<CommunityPage />);

    await waitFor(() => {
      expect(screen.getByText('Trade Journals')).toBeInTheDocument();
      expect(screen.getByText('Market Discussions')).toBeInTheDocument();
    });
  });

  it('renders error message on fetch failure', async () => {
    vi.spyOn(api, 'getCommunityCategories').mockRejectedValue(new Error('Failed to fetch'));
    render(<CommunityPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch community categories.')).toBeInTheDocument();
    });
  });
});
