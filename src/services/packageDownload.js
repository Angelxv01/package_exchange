import axios from 'axios';

const url = 'https://api.npmjs.org/downloads/point/last-day';
const UNITS = 10000;

/**
 * @description  uses the npmjs' batch API to get repository downloads
 * @param {string[]} repositoryNames is an array of repository name
 * @returns an string key object, each key is the name of repository
 */
export const batchRepositoriesLastDay = async (repositoryNames) => {
  const { data: repositories } = await axios.get(
    `${url}/${repositoryNames.join(',')}`,
  );

  const result = {};
  const keys = Object.keys(repositories);
  for (let i = 0; i < keys.length; i++) {
    result[[keys[i]]] = {
      ...repositories[keys[i]],
      downloadPerUnit: repositories[keys[i]].downloads / UNITS,
    };
  }

  return result;
};

/**
 * @description uses npmjs repository API to get the repository daily downloads
 * @param {string[]} repositoryNames string array of repository names
 * @returns string key object containing the package information
 */
export const getRepositoriesLastDay = async (repositoryNames) => {
  const repositoriesPromise = [];
  for (let i = 0; i < repositoryNames.length; i++) {
    repositoriesPromise.push(axios.get(`${url}/${repositoryNames[i]}`));
  }

  const repositoriesDownloads = await Promise.all(repositoriesPromise);
  return repositoriesDownloads.reduce((acc, { data: repository }) => {
    acc[[repository.package]] = {
      ...repository,
      downloadPerUnit: repository.downloads / UNITS,
    };
    return acc;
  }, {});
};
