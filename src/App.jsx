import { Container, Typography, Box } from '@mui/material';
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
  if (!(user || downloads)) return null;

  const calculateValue = (name, number) =>
    Math.round(number * downloads[[name]]?.downloadPerUnit * 10000) / 10000;

  return (
    <Container>
      <Typography variant="h3">{`Hello ${user?.name}!`}</Typography>
      <Typography variant="h4">My Shares</Typography>

      <Box>
        {user?.shares?.map(({ name, number }) => (
          <Typography key={name}>{`${name} - ${number} - ${
            calculateValue(name, number) || 'Loading'
          }`}</Typography>
        ))}
      </Box>
    </Container>
  );
}
