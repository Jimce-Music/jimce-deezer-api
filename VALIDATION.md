# Zod Validation & Error Handling

## Overview

Die JimceDeezerAPI verwendet Zod für strikte Validierung aller API-Antworten und implementiert benutzerdefinierte Fehlerklassen für bessere Fehlerbehandlung.

## Custom Error Classes

### DeezerAPIError
Wird geworfen, wenn die Deezer API einen HTTP-Fehler zurückgibt (z.B. 404, 500).

```typescript
try {
  const track = await client.getTrack(999999);
} catch (error) {
  if (error instanceof DeezerAPIError) {
    console.error(`API Error: Status ${error.status} - ${error.statusText}`);
  }
}
```

### DeezerNetworkError
Wird geworfen, wenn ein Netzwerkfehler auftritt oder die API nicht erreichbar ist.

```typescript
try {
  const track = await client.getTrack(123);
} catch (error) {
  if (error instanceof DeezerNetworkError) {
    console.error(`Network Error: ${error.message}`);
  }
}
```

### DeezerValidationError
Wird geworfen, wenn die API-Antwort nicht dem erwarteten Format entspricht.

```typescript
try {
  const track = await client.getTrack(123);
} catch (error) {
  if (error instanceof DeezerValidationError) {
    console.error(`Validation Error: ${error.message}`);
    // z.B.: "Invalid response format from Deezer API: title - Required"
  }
}
```

## Validation Schemas

Folgende Zod-Schemas werden für die Validierung verwendet:

- **TrackSchema** - Validiert Track-Objekte
- **AlbumSchema** - Validiert Album-Objekte
- **ArtistSchema** - Validiert Artist-Objekte
- **SearchResultSchema** - Validiert Such-Ergebnisse
- **PlaylistSchema** - Validiert Playlist-Objekte
- **PodcastSchema** - Validiert Podcast-Objekte
- **EpisodeSchema** - Validiert Episode-Objekte
- **RadioSchema** - Validiert Radio-Objekte
- **GenreSchema** - Validiert Genre-Objekte
- **GenreDataSchema** - Validiert Genre-Listen
- **ChartSchema** - Validiert Chart-Daten

## Beispiel: Robuste Fehlerbehandlung

```typescript
import { 
  JimceDeezerAPI, 
  DeezerAPIError, 
  DeezerNetworkError, 
  DeezerValidationError 
} from 'jimce-deezer-api-ts';

const client = new JimceDeezerAPI();

async function searchTracks(query: string) {
  try {
    const results = await client.search(query);
    console.log(`Found ${results.total} tracks`);
    return results;
  } catch (error) {
    if (error instanceof DeezerAPIError) {
      console.error(`API Error: ${error.message}`);
      // API ist nicht verfügbar, vielleicht Rate Limit überschritten?
    } else if (error instanceof DeezerNetworkError) {
      console.error(`Network Error: ${error.message}`);
      // Netzwerk-Problem
    } else if (error instanceof DeezerValidationError) {
      console.error(`Data Validation Error: ${error.message}`);
      // API-Antwort hat unerwartetes Format
    } else {
      console.error(`Unknown error: ${error}`);
    }
  }
}
```

## Tests

### Integration Tests (Mocked)
Die Integration-Tests verwenden gemockte API-Responses und testen:
- Validierung korrekter Datenformate
- Fehlerbehandlung bei ungültigen Daten
- Fehlerbehandlung bei API-Fehlern
- Fehlerbehandlung bei Netzwerkfehlern

### Functional Tests (Real API)
Die Functional-Tests rufen die echte Deezer API auf und:
- Validieren dass echte API-Daten dem Schema entsprechen
- Testen tatsächliche Netzwerk-Kommunikation
- Führen nebenläufige Requests durch

**Note:** Die Functional Tests verwenden konzentrierte, nicht gemockte API-Aufrufe. Sie erfordern eine aktive Netzwerkverbindung zur Deezer API.

## Best Practices

1. **Immer Error Handling implementieren:**
   ```typescript
   try {
     await client.search('query');
   } catch (error) {
     // Fehlerbehandlung
   }
   ```

2. **Instanceof Checks verwenden:**
   ```typescript
   if (error instanceof DeezerValidationError) {
     // Spezifische Fehlerlogik
   }
   ```

3. **Error Messages loggen:**
   Die Error-Messages enthalten Details über die Validierungsfehler.

4. **Retry-Logik für Netzwerkfehler:**
   ```typescript
   if (error instanceof DeezerNetworkError) {
     // Optional: Retry nach Verzögerung
   }
   ```
