import { Container, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getRepositories } from './service/packageDownload';
import { getUser } from './service/user';
import { USD } from './utils/format';

const CURRENT_USER = '25660cec-8d41-47e7-b208-165ec6ef20cd';

export default function App() {
  const [user, setUser] = useState(null);
  const [downloads, setDownloads] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      const user = await getUser(CURRENT_USER);
      setUser(user);
    };
    !user && initUser();
  }, [user]);

  useEffect(() => {
    const initDownloads = async () => {
      const downloads = await getRepositories(
        user?.shares?.map((share) => share.name),
      );
      setDownloads(downloads);
    };
    user && initDownloads();
  }, [user]);

  if (!(user && downloads)) return null;

  const calculateShareValue = (name, number) =>
    Math.round(number * downloads[[name]]?.downloadPerUnit * 10000) / 10000;
  const balance =
    user?.cash +
    user?.shares?.reduce(
      (sum, { name, number }) => sum + calculateShareValue(name, number),
      0,
    );

  return (
    <Container>
      <Typography variant="h3">{`Hi ${user?.name}!`}</Typography>

      <Box>
        <Typography variant="h5">My Balance</Typography>
        <Typography>{USD.format(balance)}</Typography>
        <Typography>{CURRENT_USER}</Typography>
      </Box>
    </Container>
  );
}
