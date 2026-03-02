import {
  Track,
  Album,
  Artist,
  Playlist,
  Podcast,
  Episode,
  SearchResult,
  Genre,
  Chart,
  Radio,
  User,
  DeezerOptions,
} from './types';

export class DeezerClient {
  private baseUrl: string = 'https://api.deezer.com';

  constructor(options?: DeezerOptions) {
    if (options?.baseUrl) {
      this.baseUrl = options.baseUrl;
    }
  }

  /**
   * Search for tracks, albums, or artists
   */
  async search(query: string): Promise<SearchResult> {
    return this.fetchJson(`/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get track details
   */
  async getTrack(trackId: number): Promise<Track> {
    return this.fetchJson(`/track/${trackId}`);
  }

  /**
   * Get album details
   */
  async getAlbum(albumId: number): Promise<Album> {
    return this.fetchJson(`/album/${albumId}`);
  }

  /**
   * Get artist details
   */
  async getArtist(artistId: number): Promise<Artist> {
    return this.fetchJson(`/artist/${artistId}`);
  }

  /**
   * Get chart data
   */
  async getChart(): Promise<Chart> {
    return this.fetchJson('/chart');
  }

  /**
   * Get playlist details
   */
  async getPlaylist(playlistId: number): Promise<Playlist> {
    return this.fetchJson(`/playlist/${playlistId}`);
  }

  /**
   * Get podcast details
   */
  async getPodcast(podcastId: number): Promise<Podcast> {
    return this.fetchJson(`/podcast/${podcastId}`);
  }

  /**
   * Get episode details
   */
  async getEpisode(episodeId: number): Promise<Episode> {
    return this.fetchJson(`/episode/${episodeId}`);
  }

  /**
   * Get radio details
   */
  async getRadio(radioId: number): Promise<Radio> {
    return this.fetchJson(`/radio/${radioId}`);
  }

  /**
   * Get all genres
   */
  async getGenres(): Promise<Genre[]> {
    const response = await this.fetchJson<{ data: Genre[] }>('/genre');
    return response.data;
  }

  /**
   * Get editorial content
   */
  async getEditorial(): Promise<any> {
    return this.fetchJson('/editorial');
  }

  /**
   * Get API info
   */
  async getInfos(): Promise<any> {
    return this.fetchJson('/infos');
  }

  /**
   * Get API options
   */
  async getOptions(): Promise<any> {
    return this.fetchJson('/options');
  }

  /**
   * Private method to handle fetch and JSON parsing
   */
  private async fetchJson<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);

      if (!response.ok) {
        throw new Error(
          `Deezer API error: ${response.status} ${response.statusText}`
        );
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch from Deezer API: ${error.message}`);
      }
      throw error;
    }
  }
}

export default DeezerClient;
