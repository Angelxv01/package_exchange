import axios from 'axios';

const url = 'https://api.npmjs.org/downloads/point/last-day';
const UNITS = 10000;

export const getRepositories = async (repositories) => {
  const { data: repositoriesDownloads } = await axios.get(
    `${url}/${repositories.join(',')}`,
  );

  const result = {};
  const keys = Object.keys(repositoriesDownloads);
  for (let i = 0; i < keys.length; i++) {
    result[[keys[i]]] = {
      ...repositoriesDownloads[keys[i]],
      downloadPerUnit: repositoriesDownloads[keys[i]].downloads / UNITS,
    };
  }

  return result;
};

export const data = 0;
