import axios from 'axios';

const url = 'https://registry.npmjs.org/-/v1/search';

/**
 * use npm API to check whether package exists
 * @param {string} name of a package
 * @returns package details
 */
const findPackage = async (name) => {
  let response;
  let searchResult;
  try {
    response = await axios.get(`${url}?text=${name}&size=1`);
    searchResult = response.data.objects;
    if (searchResult.length === 0) return;
  } catch (e) {
    return;
  }

  // since we limit the result to one, and we haven't found any problem we can directly return the array's first element
  return searchResult[0];
};

export default findPackage;
