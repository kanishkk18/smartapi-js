import axios from 'axios';

export default async function handler(req, res) {
  const { exchange } = req.query;

  try {
    // For demo purposes, using a sample API endpoint
    // In production, you should use a proper stock market API
    const response = await axios.get(`https://api.example.com/stocks/${exchange}`);
    
    // Sample data structure for testing
    const sampleStocks = exchange === 'NSE' ? [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', exchange: 'NSE' },
      { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', exchange: 'NSE' },
      { symbol: 'HDFC', name: 'HDFC Bank Ltd.', exchange: 'NSE' },
    ] : [
      { symbol: '500325', name: 'Reliance Industries Ltd.', exchange: 'BSE' },
      { symbol: '532540', name: 'Tata Consultancy Services Ltd.', exchange: 'BSE' },
      { symbol: '500180', name: 'HDFC Bank Ltd.', exchange: 'BSE' },
    ];

    res.status(200).json(sampleStocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
}