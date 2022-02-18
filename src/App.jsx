import React, { useEffect, useState } from 'react';
import { getRepositories } from './service/packageDownload';
import { getUser } from './service/user';

const CURRENT_USER = '25660cec-8d41-47e7-b208-165ec6ef20cd';

export default function App() {
  const [user, setUser] = useState(null);
  const [downloads, setDownloads] = useState(null);
  useEffect(() => getUser(CURRENT_USER).then((data) => setUser(data)), []);
  useEffect(() => {
    if (user) {
      getRepositories(user?.shares?.map((share) => share.name)).then((data) =>
        setDownloads(data),
      );
    }
  }, [user]);

  const calculateValue = (name, number) =>
    name &&
    number &&
    Math.round(number * downloads[[name]].downloadPerUnit * 10000) / 10000;

  return (
    <div>
      <p>
        Hello
        {` ${user?.name}!`}
      </p>

      <h2>My Shares</h2>
      {user?.shares?.map(({ name, number }) => (
        <div key={name}>
          <p>{`${name} - ${number}`}</p>
          <p>{calculateValue(name, number)}</p>
        </div>
      ))}
    </div>
  );
}
