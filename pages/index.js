import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exchange, setExchange] = useState('NSE');

  useEffect(() => {
    fetchStocks();
    fetchWatchlist();
  }, [exchange]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/stocks?exchange=${exchange}`);
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*');
    
    if (error) {
      console.error('Error fetching watchlist:', error);
      return;
    }
    
    setWatchlist(data);
  };

  const addToWatchlist = async (stock) => {
    const { error } = await supabase
      .from('watchlist')
      .insert([{
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange
      }]);

    if (error) {
      console.error('Error adding to watchlist:', error);
      return;
    }

    fetchWatchlist();
  };

  const removeFromWatchlist = async (symbol) => {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('symbol', symbol);

    if (error) {
      console.error('Error removing from watchlist:', error);
      return;
    }

    fetchWatchlist();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Stock Watchlist</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setExchange('NSE')}
              className={`px-4 py-2 rounded ${
                exchange === 'NSE' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              NSE
            </button>
            <button
              onClick={() => setExchange('BSE')}
              className={`px-4 py-2 rounded ${
                exchange === 'BSE' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              BSE
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Available Stocks</h2>
            {loading ? (
              <p>Loading stocks...</p>
            ) : (
              <div className="space-y-2">
                {stocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                    <button
                      onClick={() => addToWatchlist(stock)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">My Watchlist</h2>
            <div className="space-y-2">
              {watchlist.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                    <p className="text-xs text-gray-500">{stock.exchange}</p>
                  </div>
                  <button
                    onClick={() => removeFromWatchlist(stock.symbol)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}