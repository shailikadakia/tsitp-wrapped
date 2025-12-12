import 'dotenv/config';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env');
}

let cachedToken: {
  accessToken: string;
  expiresAt: number;
} | null = null;

export async function getAppAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token request failed: ${res.status} ${text}`);
  }

  const data = await res.json() as {
    access_token: string;
    token_type: string;
    expires_in: number;
  };

  cachedToken = {
    accessToken: data.access_token,
    // subtract a small buffer
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}
