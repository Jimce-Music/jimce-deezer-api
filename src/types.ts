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
