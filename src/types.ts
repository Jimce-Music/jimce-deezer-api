import { z } from 'zod';

// Custom Error Classes
export class DeezerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeezerValidationError';
  }
}

export class DeezerNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeezerNetworkError';
  }
}

export class DeezerAPIError extends Error {
  constructor(public status: number, public statusText: string) {
    super(`Deezer API error: ${status} ${statusText}`);
    this.name = 'DeezerAPIError';
  }
}

// API Response Types
export interface Track {
  id: number;
  title: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  artist: Artist;
  album: Album;
  preview: string;
}

export interface Album {
  id: number;
  title: string;
  cover: string;
  cover_medium: string;
  cover_big: string;
  artist: Artist;
}

export interface Artist {
  id: number;
  name: string;
  picture: string;
  picture_medium: string;
  picture_big: string;
}

export interface Playlist {
  id: number;
  title: string;
  description: string;
  duration: number;
  public: boolean;
  creator: User;
  tracks: Track[];
}

export interface User {
  id: number;
  name: string;
  picture: string;
}

export interface Podcast {
  id: number;
  title: string;
  description: string;
  picture: string;
  episodes: Episode[];
}

export interface Episode {
  id: number;
  title: string;
  description: string;
  duration: number;
  podcast: Podcast;
}

export interface SearchResult {
  data: Track[];
  total: number;
  next?: string;
}

export interface Genre {
  id: number;
  name: string;
  picture: string;
}

export interface Chart {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}

export interface Radio {
  id: number;
  title: string;
  description: string;
}

export interface DeezerOptions {
  baseUrl?: string;
}

// Zod Validation Schemas
export const ArtistSchema = z.object({
  id: z.number(),
  name: z.string(),
  picture: z.string().optional(),
  picture_medium: z.string().optional(),
  picture_big: z.string().optional(),
}).passthrough();

export const AlbumSchema = z.object({
  id: z.number(),
  title: z.string(),
  cover: z.string().optional(),
  cover_medium: z.string().optional(),
  cover_big: z.string().optional(),
  artist: ArtistSchema.optional(),
}).passthrough();

export const TrackSchema = z.object({
  id: z.number(),
  title: z.string(),
  duration: z.number(),
  rank: z.number().optional(),
  explicit_lyrics: z.boolean().optional(),
  artist: ArtistSchema,
  album: AlbumSchema.optional(),
  preview: z.string().optional(),
}).passthrough();

export const SearchResultSchema = z.object({
  data: z.array(TrackSchema),
  total: z.number(),
  next: z.string().optional(),
}).passthrough();

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
  picture: z.string().optional(),
}).passthrough();

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  picture: z.string().optional(),
}).passthrough();

export const PlaylistSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  duration: z.number().optional(),
  public: z.boolean().optional(),
  creator: UserSchema.optional(),
  tracks: z.array(TrackSchema).optional(),
}).passthrough();

export const EpisodeSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  duration: z.number().optional(),
  podcast: z.object({
    id: z.number(),
    title: z.string(),
  }).optional(),
}).passthrough();

export const PodcastSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  picture: z.string().optional(),
  episodes: z.array(EpisodeSchema).optional(),
}).passthrough();

export const RadioSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
}).passthrough();

export const GenreDataSchema = z.object({
  data: z.array(GenreSchema),
}).passthrough();

export const ChartSchema = z.any();
