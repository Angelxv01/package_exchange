import axios from 'axios';

const baseUrl = 'transaction';

export const tradePackage = async (transaction) =>
  axios.post(baseUrl, transaction);
