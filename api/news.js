// api/news.js — Vercel Serverless Function
// Browser calls /api/news → this function fetches from NewsAPI server-side (no CORS)

export default async function handler(req, res) {
  // Allow cross-origin requests to this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      status: 'error',
      message: 'NEWS_API_KEY is not set in Vercel environment variables.',
    });
  }

  const { q = '', sortBy = 'publishedAt', pageSize = 30 } = req.query;

  const url = new URL('https://newsapi.org/v2/top-headlines');
  url.searchParams.set('language', 'en');
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('sortBy', sortBy);
  url.searchParams.set('apiKey', apiKey);
  if (q) url.searchParams.set('q', q);

  try {
    const upstream = await fetch(url.toString());
    const data     = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ status: 'error', message: 'Failed to reach NewsAPI.' });
  }
}
