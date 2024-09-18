// api/proxy.js

export default async function handler(req, res) {
    // Append the request path to the backend base URL
    const backendUrl = `http://172.16.4.89:9021/api/logXP${req.url}`;
  
    try {
      // Forward the request to the backend
      const response = await fetch(backendUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          'Content-Type': 'application/json'
        },
        body: req.method !== 'GET' ? JSON.stringify(req.body) : null
      });
  
      // Forward the response back to the client
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  }
  