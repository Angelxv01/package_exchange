import axios from 'axios';

const url = 'https://api.npmjs.org/downloads/point/last-day';
const UNITS = 10000;

/**
 * @description  uses the npmjs' batch API to get package downloads
 * @param {string[]} packageNames is an array of package name
 * @returns an string key object, each key is the name of package
 */
export const batchLastDayPackageDonwload = async (packageNames) => {
  const { data: packageDownloads } = await axios.get(
    `${url}/${packageNames.join(',')}`,
  );

  const result = {};
  const keys = Object.keys(packageDownloads);
  for (let i = 0; i < keys.length; i++) {
    result[[keys[i]]] = {
      ...packageDownloads[keys[i]],
      downloadPerUnit: packageDownloads[keys[i]].downloads / UNITS,
    };
  }

  return result;
};

/**
 * @description uses npmjs package API to get the package daily downloads
 * @param {string[]} packageNames string array of package names
 * @returns string key object containing the package information
 */
export const getLastDayPackagesDownload = async (packageNames) => {
  const packagesPromise = [];
  for (let i = 0; i < packageNames.length; i++) {
    packagesPromise.push(axios.get(`${url}/${packageNames[i]}`));
  }

  let packageDownloads;
  try {
    packageDownloads = await Promise.all(packagesPromise);
  } catch (e) {
    return;
  }

  return packageDownloads.reduce((acc, { data }) => {
    acc[[data.package]] = {
      ...data,
      downloadPerUnit: data.downloads / UNITS,
    };
    return acc;
  }, {});
};

export const getLastDayPackageDownload = async (packageName) => {
  const packageDownloadRaw = await getLastDayPackagesDownload([packageName]);
  if (!packageDownloadRaw) return;
  return Object.values(packageDownloadRaw)[0];
};
