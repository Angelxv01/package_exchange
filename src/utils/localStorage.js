export const loadState = (state) => {
  try {
    const serializedState = localStorage.getItem(state);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state, serializedState) => {
  const stringifyState = JSON.stringify(serializedState);
  localStorage.setItem(state, stringifyState);
};

// https://stackoverflow.com/questions/62533299/javascript-tomorrows-date-and-0000-time
export const saveTempState = (state, serializedState) => {
  let expireDate = new Date();
  // this expire date is tomorrow
  expireDate.setHours(24, 0, 0, 0);

  saveState(state, { data: serializedState, expireDate });
};

export const removeState = (state) => {
  localStorage.removeItem(state);
};
