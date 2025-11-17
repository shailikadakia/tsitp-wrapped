// Spotify API Configuration
const SPOTIFY_CLIENT_ID = '30dea5987bc44dc7b7d2aea3b7276e83'; 
const REDIRECT_URI = window.location.origin + '/callback';
const SCOPES = [
  'user-top-read',
  'user-read-recently-played',
  'user-read-private'
].join(' ');

// Generate random string for PKCE
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

// Generate code challenge for PKCE
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier)
  );
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Start Spotify OAuth flow
export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store code verifier for later use
  localStorage.setItem('spotify_code_verifier', codeVerifier);
  
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });
  
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string): Promise<string> {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  
  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }
  
  const data = await response.json();
  
  // Store tokens
  localStorage.setItem('spotify_access_token', data.access_token);
  localStorage.setItem('spotify_refresh_token', data.refresh_token);
  localStorage.setItem('spotify_token_expires', (Date.now() + data.expires_in * 1000).toString());
  
  // Clean up code verifier
  localStorage.removeItem('spotify_code_verifier');
  
  return data.access_token;
}

// Get stored access token
export function getAccessToken(): string | null {
  const token = localStorage.getItem('spotify_access_token');
  const expires = localStorage.getItem('spotify_token_expires');
  
  if (!token || !expires) {
    return null;
  }
  
  // Check if token is expired
  if (Date.now() > parseInt(expires)) {
    // Token expired - would need to refresh here
    return null;
  }
  
  return token;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

// Logout
export function logout() {
  console.log('in logout')
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expires');
  localStorage.removeItem('spotify_code_verifier');
}

// Fetch user's top tracks
export async function getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term', limit: number = 50) {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch top tracks');
  }
  
  return response.json();
}

// Fetch audio features for tracks
export async function getAudioFeatures(trackIds: string[]) {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(
    `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch audio features');
  }
  
  return response.json();
}

// Fetch user profile
export async function getUserProfile() {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return response.json();
}

// Get user's summer data (combines tracks and audio features)
export async function getSummerData() {
  try {
    // Fetch top tracks from summer (short_term = last 4 weeks)
    const topTracksData = await getTopTracks('short_term', 50);
    
    // Get track IDs
    const trackIds = topTracksData.items.map((track: any) => track.id);
    
    // Fetch audio features
    const audioFeaturesData = await getAudioFeatures(trackIds);
    
    // Combine track info with audio features
    const tracks = topTracksData.items.map((track: any, index: number) => {
      const features = audioFeaturesData.audio_features[index];
      return {
        name: track.name,
        artist: track.artists[0].name,
        energy: features?.energy || 0,
        valence: features?.valence || 0,
        danceability: features?.danceability || 0,
        acousticness: features?.acousticness || 0,
        plays: 0, // Spotify doesn't provide play counts in this endpoint
      };
    });
    
    return tracks;
  } catch (error) {
    console.error('Error fetching summer data:', error);
    throw error;
  }
}

