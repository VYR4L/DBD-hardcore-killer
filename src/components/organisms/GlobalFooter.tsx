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
  <Typography variant="body2" color="text.secondary" align="center">
    This page uses images and icons from Dead by Daylight Wiki (https://deadbydaylight.fandom.com/wiki/Dead_by_Daylight_Wiki) which is licensed under Creative Commons Attribution-NonCommercial-Share Alike License 3.0,
     and from Dead By Daylight fandom (https://deadbydaylight.fandom.com/) which is licensed under Creative Commons Attribution-Share Alike License.
  </Typography>
  <Typography variant="body2" color="text.secondary" align="center" mt={1}>
    Made with 💜 for DBD Players | {new Date().getFullYear()}
  </Typography>
  </Container>
  </Box>
  );
};
