import { Container, Typography, Stack, Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getRepositories } from './services/packageDownload';
import { getUser } from './services/user';
import { USD } from './utils/format';

const CURRENT_USER = '25660cec-8d41-47e7-b208-165ec6ef20cd';
// const CURRENT_USER = 'de200efe-c9d3-4f12-b295-919daeec2914';

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
    if (!user) return;
    const initDownloads = async () => {
      const downloads = await getRepositories(
        user?.shares?.map((share) => share.name),
      );
      setDownloads(downloads);
    };

    initDownloads();
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
    <Container py={2}>
      <Stack spacing={2}>
        <Typography
          variant="h3"
          component="h1"
        >{`Hi ${user?.name}!`}</Typography>

        <SectionPaper>
          <Typography variant="h5" component="h2">
            My Balance
          </Typography>
          <Typography>{USD.format(balance)}</Typography>
          <Typography>{CURRENT_USER}</Typography>
        </SectionPaper>

        <SectionPaper>
          <Typography variant="h5" component="h2">
            Packages
          </Typography>
          <Grid container gap="1rem" mt="0.5rem">
            {user?.shares?.map(({ name, number }) => (
              <Grid
                item
                key={name}
                xs={3}
                textAlign="center"
                borderRadius="0.5rem"
                border={1}
                borderColor="primary.main"
              >
                <Typography>{name}</Typography>
                <Typography>{number}</Typography>
              </Grid>
            ))}
          </Grid>
        </SectionPaper>
      </Stack>
    </Container>
  );
}

// eslint-disable-next-line react/prop-types
const SectionPaper = ({ children }) => (
  <Paper
    elevation={0}
    sx={{ py: 2, px: 1, border: 3, borderColor: 'primary.main' }}
  >
    {children}
  </Paper>
);
