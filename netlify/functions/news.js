// netlify/functions/news.js
// Serverless function for Netlify deployment

exports.handler = async function(event, context) {
  // Allow cross-origin requests to this endpoint
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json'
  };

  const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'NEWS_API_KEY is not set in Netlify environment variables.'
      })
    };
  }

  // Parse query parameters
  const q = event.queryStringParameters?.q || '';
  const sortBy = event.queryStringParameters?.sortBy || 'publishedAt';
  const pageSize = event.queryStringParameters?.pageSize || 30;

  const url = new URL('https://newsapi.org/v2/top-headlines');
  url.searchParams.set('language', 'en');
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('sortBy', sortBy);
  url.searchParams.set('apiKey', apiKey);
  if (q) url.searchParams.set('q', q);

  try {
    const upstream = await fetch(url.toString());
    const data = await upstream.json();
    return {
      statusCode: upstream.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ status: 'error', message: 'Failed to reach NewsAPI.' })
    };
  }
};
