import {
  Container,
  Typography,
  Stack,
  Grid,
  Paper,
  Box,
  Chip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getRepositories } from './services/packageDownload';
import { getUser } from './services/user';
import { USD } from './utils/format';
import Icon from 'supercons';

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
    <Container sx={{ px: 1 }}>
      <Icon glyph="search" size={32} />
      <Stack spacing={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography
            variant="h3"
            component="h1"
          >{`Hi ${user?.name}!`}</Typography>
          <Chip
            label="pro"
            sx={{
              background:
                'linear-gradient(45deg, rgba(255,179,185,1) 0%, rgba(252,245,199,1) 100%)',
              fontWeight: 'bold',
            }}
          />
        </Box>

        <SectionPaper>
          <Typography
            variant="h5"
            component="h2"
            sx={{ color: 'text.secondary' }}
          >
            My Balance
          </Typography>
          <Typography variant="h3">{USD.format(balance)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {CURRENT_USER.split('-')[0]} * * * *
          </Typography>
        </SectionPaper>

        <SectionPaper sx={{ bgcolor: 'custom.gray', py: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Icon glyph="transactions" size={32} />
            <Typography variant="h5" component="h2">
              Packages
            </Typography>
          </Box>
          <Grid container gap={2} mt={2}>
            {user?.shares?.map(({ name, number }) => (
              <Grid
                item
                key={name}
                xs={2}
                textAlign="center"
                bgcolor="common.white"
                borderRadius={2}
                py={2}
                px={1}
                sx={{
                  background:
                    'linear-gradient(45deg, rgba(255,179,185,1) 0%, rgba(252,245,199,1) 100%)',
                }}
              >
                <Typography fontWeight="bold">{name}</Typography>
                <Typography mt={1} fontWeight="bold">
                  {number}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </SectionPaper>
      </Stack>
    </Container>
  );
}

// eslint-disable-next-line react/prop-types
const SectionPaper = ({ children, sx, ...props }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        py: 1,
        px: 2,
        borderRadius: 2,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};
