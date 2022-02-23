import axios from 'axios';

const baseUrl = 'user';

export const getUser = async (id) => {
  const { data } = await axios.get(`${baseUrl}/${id}`);
  return data;
};

export const name = 0;
