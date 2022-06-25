import {
  Container,
  Typography,
  Stack,
  Grid,
  Paper,
  Box,
  Chip,
  Button,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  getLastDayPackagesDownload,
  getLastDayPackageDownload,
} from './services/packageDownload';
import { getUser } from './services/user';
import { tradePackage } from './services/transaction';
import { NUMBER, USD } from './utils/format';
import Icon from 'supercons';
import { v4 as uuid4 } from 'uuid';
import { roundTo } from './utils/math';

const CURRENT_USER = '25660cec-8d41-47e7-b208-165ec6ef20cd';
// const CURRENT_USER = 'de200efe-c9d3-4f12-b295-919daeec2914';
const BUY = 'BUY';
const SELL = 'SELL';

export default function App() {
  const [user, setUser] = useState(null);
  const [downloads, setDownloads] = useState(null);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [shareNumber, setShareNumber] = useState('');

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
      const downloads = await getLastDayPackagesDownload(
        user?.shares?.map((share) => share.name),
      );
      setDownloads(downloads);
    };

    initDownloads();
  }, [user]);

  if (!(user && downloads)) return null;

  const getPackageValue = (name, number) =>
    Math.round(number * downloads[[name]]?.downloadPerUnit * 10000) / 10000;

  const searchPackage = async (e) => {
    e.preventDefault();
    const data = await getLastDayPackageDownload(filter);
    setSelected(data);
    setFilter('');
  };

  const buyPackage = async () => {
    if (!canIBuy) return;
    const price = roundTo(shareValue, 2);

    // create and send transaction
    const transaction = {
      price,
      id: uuid4(),
      user: user.id,
      type: BUY,
      package: selected.package,
      number: parseInt(shareNumber),
      date: new Date(),
    };
    const v = await tradePackage(transaction);
    console.log(v);
    setSelected(false);
  };

  const balance =
    user?.cash +
    user?.shares?.reduce(
      (sum, { name, number }) => sum + getPackageValue(name, number),
      0,
    );
  const shareValue =
    selected && selected.downloadPerUnit * parseInt(shareNumber);
  const canIBuy = shareValue ? shareValue <= user.cash : false;

  return (
    <Container sx={{ p: 1 }}>
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
          <Typography variant="h5" component="h2" color="text.secondary">
            My Balance
          </Typography>
          <Typography variant="h3">{USD.format(balance)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {CURRENT_USER.split('-')[0]} * * * *
          </Typography>
        </SectionPaper>

        <SectionPaper sx={{ bgcolor: 'custom.gray', py: 4 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Icon glyph="transactions" size={32} />
            <Typography variant="h5" component="h2">
              Packages
            </Typography>
          </Box>
          <Grid container gap={3} mt={4} justifyContent="center">
            {user?.shares?.map(({ name, number }) => (
              <Grid
                item
                key={name}
                xs="auto"
                textAlign="center"
                bgcolor="common.white"
                borderRadius={2}
                px={2}
                py={1}
                sx={{
                  background:
                    'linear-gradient(45deg, rgba(255,179,185,1) 0%, rgba(252,245,199,1) 100%)',
                  cursor: 'pointer',
                }}
                onClick={() => setSelected(downloads[[name]])}
              >
                <Typography>{name}</Typography>
                <Typography mt={1}>{number}</Typography>
              </Grid>
            ))}
          </Grid>
        </SectionPaper>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          component="form"
          gap={1}
          onSubmit={searchPackage}
        >
          <TextField
            id="outlined-basic"
            label="package"
            variant="outlined"
            value={filter}
            onChange={({ target }) => setFilter(target.value)}
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Box>

        {selected && (
          <Grid
            container
            justifyContent="flex-end"
            bgcolor="secondary.light"
            p={2}
            pt={1}
            borderRadius={2}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5" component="h2" color="text.secondary">
                  Package value
                </Typography>
              </Grid>
              <Grid item>
                <Icon
                  glyph="view-close"
                  size={32}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelected(null);
                    setShareNumber('');
                  }}
                />
              </Grid>
            </Grid>

            <Grid
              container
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Grid item>
                <Typography variant="h6">{selected.package}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" fontSize="1rem">
                  {NUMBER.format(selected.downloadPerUnit)}
                </Typography>
              </Grid>
            </Grid>

            <Grid container gap={1}>
              <TextField
                value={shareNumber}
                onChange={({ target }) => setShareNumber(target.value)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <Button
                variant="contained"
                disabled={!canIBuy}
                onClick={buyPackage}
              >
                Buy
              </Button>
              {shareNumber && <Typography>{USD.format(shareValue)}</Typography>}
            </Grid>
          </Grid>
        )}
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
