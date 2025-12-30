import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export const GlobalFooter: React.FC = () => {
  return (
  <Box
  component="footer"
  sx={{
  py: 3,
  px: 2,
  mt: 'auto',
  borderTop: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
  }}
  >
  <Container maxWidth="lg">
  <Typography variant="body2" color="text.secondary" align="center">
    Hardcore Killer - Season 4 | Dead by Daylight Challenge Tracker
  </Typography>
  <Typography variant="body2" color="text.secondary" align="center" mt={1}>
    Made with 💜 for DBD Players | {new Date().getFullYear()}
  </Typography>
  </Container>
  </Box>
  );
};
