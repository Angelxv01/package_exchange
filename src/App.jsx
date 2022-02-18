import React, { useEffect, useState } from 'react';
import { getUser } from './service/user';

const CURRENT_USER = '25660cec-8d41-47e7-b208-165ec6ef20cd';

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => getUser(CURRENT_USER).then((data) => setUser(data)), []);
  return (
    <div>
      Hello
      {` ${user?.name}!`}
    </div>
  );
}
