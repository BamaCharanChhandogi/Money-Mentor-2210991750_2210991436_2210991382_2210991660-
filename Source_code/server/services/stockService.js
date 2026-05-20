import axios from 'axios';

// export const getStockPrice = async (symbol) => {
//   try {
//     const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
//       params: {
//         region: 'US',
//         interval: '1d',
//         range: '1d'
//       }
//     });

//     const quote = response.data.chart.result[0];
//     return quote.meta.regularMarketPrice;
//   } catch (error) {
//     console.error(`Error fetching price for ${symbol}:`, error);
//     throw new Error('Unable to fetch stock price');
//   }
// };

export const getStockDetails = async (symbol) => {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
      params: {
        region: 'US',
        interval: '1d',
        range: '1mo'
      }
    });

    const quote = response.data.chart.result[0];
    return {
      symbol,
      currentPrice: quote.meta.regularMarketPrice,
      previousClose: quote.meta.previousClose,
      fiftyTwoWeekHigh: quote.meta.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.meta.fiftyTwoWeekLow,
      marketCap: quote.meta.marketCap
    };
  } catch (error) {
    console.error(`Error fetching details for ${symbol}:`, error);
    throw new Error('Unable to fetch stock details');
  }
};