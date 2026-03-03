import { z } from 'zod';
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
  DeezerValidationError,
  DeezerNetworkError,
  DeezerAPIError,
  TrackSchema,
  SearchResultSchema,
  GenreDataSchema,
  ChartSchema,
  PlaylistSchema,
  PodcastSchema,
  EpisodeSchema,
  RadioSchema,
  ArtistSchema,
  AlbumSchema,
} from './types';

export class JimceDeezerAPI {
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
        throw new DeezerAPIError(response.status, response.statusText);
      }

      const data = await response.json();
      
      // Validate response based on endpoint
      const validatedData = this.validateResponseData(endpoint, data);
      return validatedData as T;
    } catch (error) {
      if (error instanceof DeezerAPIError) {
        throw error;
      }
      if (error instanceof DeezerValidationError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new DeezerNetworkError(`Failed to fetch from JimceDeezerAPI: ${error.message}`);
      }
      throw new DeezerNetworkError('Failed to fetch from JimceDeezerAPI: Unknown error');
    }
  }

  /**
   * Validate response data based on endpoint
   */
  private validateResponseData(endpoint: string, data: any): any {
    try {
      if (endpoint.startsWith('/search')) {
        return SearchResultSchema.parse(data);
      }
      if (endpoint.startsWith('/track/')) {
        return TrackSchema.parse(data);
      }
      if (endpoint.startsWith('/album/')) {
        return AlbumSchema.parse(data);
      }
      if (endpoint.startsWith('/artist/')) {
        return ArtistSchema.parse(data);
      }
      if (endpoint.startsWith('/chart')) {
        return ChartSchema.parse(data);
      }
      if (endpoint.startsWith('/playlist/')) {
        return PlaylistSchema.parse(data);
      }
      if (endpoint.startsWith('/podcast/')) {
        return PodcastSchema.parse(data);
      }
      if (endpoint.startsWith('/episode/')) {
        return EpisodeSchema.parse(data);
      }
      if (endpoint.startsWith('/radio/')) {
        return RadioSchema.parse(data);
      }
      if (endpoint.startsWith('/genre')) {
        return GenreDataSchema.parse(data);
      }
      // For endpoints without specific validation, return as is
      return data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = (error as z.ZodError)
          .issues
          .map((issue: any) => `${issue.path.join('.')} - ${issue.message}`)
          .join(', ');
        throw new DeezerValidationError(
          `Invalid response format from Deezer API: ${errorMessages}`
        );
      }
      throw error;
    }
  }
}

export default JimceDeezerAPI;
