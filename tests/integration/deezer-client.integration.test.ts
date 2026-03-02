import { DeezerClient } from '../../src/deezer';

// Mock fetch globally
global.fetch = jest.fn();

describe('DeezerClient Integration Tests (Mocked)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Search', () => {
    it('should call fetch with correct URL for search', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              title: 'Test Track',
              duration: 180,
              artist: { id: 1, name: 'Test Artist' },
            },
          ],
          total: 1,
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new DeezerClient();
      const results = await client.search('test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.deezer.com/search')
      );
      expect(results.total).toBe(1);
      expect(results.data[0].title).toBe('Test Track');
    });

    it('should handle search with special characters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [], total: 0 }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new DeezerClient();
      await client.search('Bella & Napoli');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('Bella%20%26%20Napoli')
      );
    });
  });

  describe('GetTrack', () => {
    it('should call fetch with correct track URL', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 123,
          title: 'Test Song',
          duration: 240,
          artist: { id: 1, name: 'Artist' },
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new DeezerClient();
      const track = await client.getTrack(123);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.deezer.com/track/123'
      );
      expect(track.id).toBe(123);
      expect(track.title).toBe('Test Song');
    });
  });

  describe('GetAlbum', () => {
    it('should call fetch with correct album URL', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 456,
          title: 'Test Album',
          artist: { id: 1, name: 'Artist' },
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new DeezerClient();
      const album = await client.getAlbum(456);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.deezer.com/album/456'
      );
      expect(album.id).toBe(456);
    });
  });

  describe('GetArtist', () => {
    it('should call fetch with correct artist URL', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 789,
          name: 'Test Artist',
          picture: 'https://example.com/pic.jpg',
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new DeezerClient();
      const artist = await client.getArtist(789);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.deezer.com/artist/789'
      );
      expect(artist.name).toBe('Test Artist');
    });
  });

  describe('GetChart', () => {
    it('should call fetch with chart URL', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          tracks: [],
          albums: [],
          artists: [],
          playlists: [],
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new DeezerClient();
      const chart = await client.getChart();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.deezer.com/chart'
      );
      expect(chart.tracks).toBeDefined();
    });
  });

  describe('GetGenres', () => {
    it('should call fetch and extract data array from genres', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [
            { id: 1, name: 'Rock', picture: 'url' },
            { id: 2, name: 'Pop', picture: 'url' },
          ],
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new DeezerClient();
      const genres = await client.getGenres();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.deezer.com/genre'
      );
      expect(Array.isArray(genres)).toBe(true);
      expect(genres.length).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should throw error on API error response', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new DeezerClient();

      await expect(client.getTrack(999999)).rejects.toThrow(
        'Deezer API error'
      );
    });

    it('should throw error on fetch failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const client = new DeezerClient();

      await expect(client.search('test')).rejects.toThrow(
        'Failed to fetch from Deezer API'
      );
    });
  });

  describe('Custom Base URL', () => {
    it('should use custom base URL', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new DeezerClient({ baseUrl: 'https://custom.api.com' });
      await client.search('test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom.api.com')
      );
    });
  });
});
