import axios from 'axios';

const baseUrl = 'https://api.giphy.com/v1/gifs';
const apiKey = 'oeEYNF2iPH3MtWewQpUTXh081QXrMG89';

export const fetchTrendingGifs = async (params) => {
  const { data } = await axios.get(`${baseUrl}/trending`, {
    params: {
      api_key: apiKey,
      ...params,
    },
  });
  return data;
};

export const searchGifs = async (params) => {
  const { data } = await axios.get(`${baseUrl}/search`, {
    params: {
      api_key: apiKey,
      ...params,
    },
  });
  return data;
};
