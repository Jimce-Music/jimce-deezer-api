# Jimce Deezer API Client

A TypeScript-based Deezer API Client for Node.js.

## Installation

```bash
npm install jimce-deezer-api
```

## Usage

### Basic Usage

```typescript
import { JimceDeezerAPI } from 'jimce-deezer-api';

const client = new JimceDeezerAPI();

// Search for a track
const results = await client.search('YOUR SEARCH');
const data = JSON.stringify(results, null, 2)
console.log(data);
```

### API Methods

#### Search
```typescript
const results = await client.search('Bella Napoli');
```

#### Tracks
```typescript
const track = await client.getTrack(<TRACK_ID>);
```

#### Albums
```typescript
const album = await client.getAlbum(<ALBUM_ID>);
```

#### Artists
```typescript
const artist = await client.getArtist(<ARTIST_ID>);
```

#### Playlists
```typescript
const playlist = await client.getPlaylist(<PLAYLIST_ID>);
```

#### Podcasts
```typescript
const podcast = await client.getPodcast(<PODCAST_ID>);
```

#### Episodes
```typescript
const episode = await client.getEpisode(<EPISODE_ID>);
```

#### Radio
```typescript
const radio = await client.getRadio(<RADIO_ID>);
```

#### Charts (Top Charts)
```typescript
const chart = await client.getChart();
```

#### Genres
```typescript
const genres = await client.getGenres();
```

#### Editorial
```typescript
const editorial = await client.getEditorial();
```

#### API Information
```typescript
const infos = await client.getInfos();
const options = await client.getOptions();
```

## Types

The package comes with full TypeScript support:

```typescript
import { Track, Album, Artist, SearchResult } from 'jimce-deezer-api';

const results: SearchResult = await client.search('Query');
const track: Track = results.data[0];
```

## Development

### Build
```bash
npm run build
```

### Development Watch Mode
```bash
npm run dev
```

### Testing

The package includes two different test suites:

#### 1. Integration Tests (Mocked)
Standard unit tests with mocked API responses:

```bash
npm test
```

These tests:
- ✅ Mock the fetch requests
- ✅ Test parameter encoding
- ✅ Test error handling
- ✅ Completely isolated from the real API

#### 2. Functional Tests (Real API)
End-to-end tests against the real Deezer API:

```bash
npm run test:functional
```

These tests validate:
- ✅ All 13 API endpoints work
- ✅ Response structures are correct
- ✅ Data types are correct
- ✅ Concurrent requests work

#### All Tests
```bash
npm run test:all
```

#### Test Watch Mode
```bash
npm run test:watch
```

### GitHub Actions (Automated Tests)

The CI pipeline is defined in [.github/workflows/tests.yml](.github/workflows/tests.yml).

- **Integration Tests (mocked)** run automatically on:
	- Pull requests
	- Push to `main` and `master`
- **Functional Tests (real Deezer API, not mocked)** run automatically on:
	- Push to `main` and `master`
	- Schedule (Monday and Thursday at 02:00 UTC)
	- Manual trigger via `workflow_dispatch`

This keeps PR feedback fast while real API tests run automatically on a regular schedule.

### Test Structure
```
tests/
├── integration/
│   └── deezer-client.integration.test.ts  (Mocked Tests)
├── functional/
│   └── deezer-api.functional.test.ts      (Real API Tests)
└── setup.ts
```

## License

[MIT License](LICENSE)
