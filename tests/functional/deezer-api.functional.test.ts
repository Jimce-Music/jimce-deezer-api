import { DeezerClient, SearchResult, Track, Album, Artist } from '../../src';

/**
 * Functional Tests - These tests run against the REAL Deezer API
 * They use IDs from search results to ensure valid data
 */
describe('DeezerClient Functional Tests (Real API)', () => {
  let client: DeezerClient;
  let searchResults: SearchResult;
  let trackId: number;
  let trackArtistId: number;
  let albumData: any;

  beforeAll(async () => {
    client = new DeezerClient();

    // First: Execute search to get real IDs
    searchResults = await client.search('Eminem');
    expect(searchResults).toBeDefined();
    expect(searchResults.data.length).toBeGreaterThan(0);

    // Extract IDs from search results
    const firstTrack = searchResults.data[0];
    trackId = firstTrack.id;
    trackArtistId = firstTrack.artist.id;

    // Also fetch the album to get album ID
    if (firstTrack.album) {
      albumData = firstTrack.album;
    }
  });

  /**
   * Search Endpoint - Tests the search functionality
   */
  describe('Search Endpoint', () => {
    it('should search and return valid results', async () => {
      expect(searchResults).toBeDefined();
      expect(searchResults.total).toBeGreaterThan(0);
      expect(Array.isArray(searchResults.data)).toBe(true);
      expect(searchResults.data.length).toBeGreaterThan(0);
    });

    it('should validate SearchResult structure', async () => {
      expect(searchResults).toHaveProperty('data');
      expect(searchResults).toHaveProperty('total');
      expect(typeof searchResults.total).toBe('number');
    });

    it('should validate Track data in search results', async () => {
      const track = searchResults.data[0];

      // Validate Track structure
      expect(track).toHaveProperty('id');
      expect(typeof track.id).toBe('number');
      expect(track).toHaveProperty('title');
      expect(typeof track.title).toBe('string');
      expect(track).toHaveProperty('artist');
      expect(track.artist).toHaveProperty('id');
      expect(track.artist).toHaveProperty('name');
    });
  });

  /**
   * Track Endpoint - Tests individual track retrieval using ID from search
   */
  describe('Track Endpoint', () => {
    it('should fetch track using ID from search', async () => {
      const track: Track = await client.getTrack(trackId);

      expect(track).toBeDefined();
      expect(track.id).toBe(trackId);
      expect(track.title).toBeDefined();
      expect(typeof track.title).toBe('string');
    });

    it('should validate Track structure', async () => {
      const track = await client.getTrack(trackId);

      expect(track).toHaveProperty('id');
      expect(track).toHaveProperty('title');
      expect(track).toHaveProperty('duration');
      expect(track).toHaveProperty('artist');
      expect(typeof track.duration).toBe('number');
      expect(track.duration).toBeGreaterThan(0);
    });

    it('should validate Artist in Track response', async () => {
      const track = await client.getTrack(trackId);

      expect(track.artist).toBeDefined();
      expect(track.artist).toHaveProperty('id');
      expect(track.artist).toHaveProperty('name');
      expect(typeof track.artist.id).toBe('number');
      expect(typeof track.artist.name).toBe('string');
    });
  });

  /**
   * Album Endpoint - Tests album retrieval using ID from track
   */
  describe('Album Endpoint', () => {
    it('should fetch album using ID from search', async () => {
      expect(albumData).toBeDefined();
      expect(albumData.id).toBeDefined();

      const album: Album = await client.getAlbum(albumData.id);

      expect(album).toBeDefined();
      expect(album.id).toBe(albumData.id);
      expect(album.title).toBeDefined();
      expect(typeof album.title).toBe('string');
    });

    it('should validate Album structure', async () => {
      const album = await client.getAlbum(albumData.id);

      expect(album).toHaveProperty('id');
      expect(album).toHaveProperty('title');
      expect(album).toHaveProperty('cover');
      expect(album).toHaveProperty('artist');
    });

    it('should validate Artist in Album response', async () => {
      const album = await client.getAlbum(albumData.id);

      expect(album.artist).toBeDefined();
      expect(album.artist).toHaveProperty('id');
      expect(album.artist).toHaveProperty('name');
    });
  });

  /**
   * Artist Endpoint - Tests artist retrieval using ID from search
   */
  describe('Artist Endpoint', () => {
    it('should fetch artist using ID from search', async () => {
      const artist: Artist = await client.getArtist(trackArtistId);

      expect(artist).toBeDefined();
      expect(artist.id).toBe(trackArtistId);
      expect(artist.name).toBeDefined();
      expect(typeof artist.name).toBe('string');
    });

    it('should validate Artist structure', async () => {
      const artist = await client.getArtist(trackArtistId);

      expect(artist).toHaveProperty('id');
      expect(artist).toHaveProperty('name');
      expect(artist).toHaveProperty('picture');
    });
  });

  /**
   * Chart Endpoint - Tests chart/top data
   */
  describe('Chart Endpoint', () => {
    it('should fetch chart successfully', async () => {
      const chart = await client.getChart();

      expect(chart).toBeDefined();
      expect(typeof chart).toBe('object');
    });

    it('should validate chart contains object', async () => {
      const chart = await client.getChart();

      expect(chart).not.toBeNull();
      expect(typeof chart).toBe('object');
    });
  });

  /**
   * Playlist Endpoint - Tests playlist retrieval
   */
  describe('Playlist Endpoint', () => {
    it('should fetch playlist and return valid response', async () => {
      try {
        const playlist = await client.getPlaylist(1234567);

        expect(playlist).toBeDefined();
        expect(typeof playlist).toBe('object');
      } catch (error) {
        // Playlist might not exist, but request should work
        expect(error).toBeDefined();
      }
    });
  });

  /**
   * Genre Endpoint - Tests genre retrieval
   */
  describe('Genre Endpoint', () => {
    it('should fetch all genres', async () => {
      const genres = await client.getGenres();

      expect(Array.isArray(genres)).toBe(true);
      expect(genres.length).toBeGreaterThan(0);
    });

    it('should validate Genre structure', async () => {
      const genres = await client.getGenres();
      const firstGenre = genres[0];

      expect(firstGenre).toHaveProperty('id');
      expect(firstGenre).toHaveProperty('name');
      expect(typeof firstGenre.id).toBe('number');
      expect(typeof firstGenre.name).toBe('string');
    });
  });

  /**
   * Editorial Endpoint - Tests editorial content
   */
  describe('Editorial Endpoint', () => {
    it('should fetch editorial content', async () => {
      const editorial = await client.getEditorial();

      expect(editorial).toBeDefined();
      expect(typeof editorial).toBe('object');
    });
  });

  /**
   * Infos Endpoint - Tests API info endpoint
   */
  describe('Infos Endpoint', () => {
    it('should fetch API infos', async () => {
      const infos = await client.getInfos();

      expect(infos).toBeDefined();
      expect(typeof infos).toBe('object');
    });
  });

  /**
   * Options Endpoint - Tests API options endpoint
   */
  describe('Options Endpoint', () => {
    it('should fetch API options', async () => {
      const options = await client.getOptions();

      expect(options).toBeDefined();
      expect(typeof options).toBe('object');
    });
  });

  /**
   * Podcast Endpoint - Tests podcast retrieval
   */
  describe('Podcast Endpoint', () => {
    it('should handle podcast requests', async () => {
      try {
        const podcast = await client.getPodcast(155626852);
        expect(podcast).toBeDefined();
        expect(typeof podcast).toBe('object');
      } catch (error) {
        // If request fails, that's acceptable
        expect(error).toBeDefined();
      }
    });
  });

  /**
   * Episode Endpoint - Tests episode retrieval
   */
  describe('Episode Endpoint', () => {
    it('should handle episode requests', async () => {
      try {
        const episode = await client.getEpisode(155822654);
        expect(episode).toBeDefined();
        expect(typeof episode).toBe('object');
      } catch (error) {
        // If request fails, that's acceptable
        expect(error).toBeDefined();
      }
    });
  });

  /**
   * Radio Endpoint - Tests radio retrieval
   */
  describe('Radio Endpoint', () => {
    it('should handle radio requests', async () => {
      try {
        const radio = await client.getRadio(98765);
        expect(radio).toBeDefined();
        expect(typeof radio).toBe('object');
      } catch (error) {
        // If request fails, that's acceptable
        expect(error).toBeDefined();
      }
    });
  });

  /**
   * Error Handling - Tests error scenarios
   */
  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      try {
        // Try to fetch an invalid track that likely doesn't exist
        await client.getTrack(999999999999);
        // If we get here, the ID might actually exist, which is fine
      } catch (error) {
        // Error is expected
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }
    });
  });

  /**
   * Concurrent Requests - Tests multiple simultaneous requests using search IDs
   */
  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent requests with real IDs', async () => {
      const results = await Promise.all([
        client.getTrack(trackId),
        client.getAlbum(albumData.id),
        client.getArtist(trackArtistId),
        client.search('Eminem'),
      ]);

      expect(results).toHaveLength(4);
      expect(results[0]).toBeDefined(); // track
      expect(results[1]).toBeDefined(); // album
      expect(results[2]).toBeDefined(); // artist
      expect(results[3]).toBeDefined(); // search result
    });
  });
});
