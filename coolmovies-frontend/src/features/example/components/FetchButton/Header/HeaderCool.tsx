// components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import Logo from '../../../../../assets/Images/Logo/Logo.png'

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'center', minHeight: { xs: 56, sm: 64 } }}>
        <Box
          component="img"
          src={(Logo as any).src}               // ← coloque sua logo em public/logo.png
          alt="Logo"
          sx={{
            height: { xs: 40, sm: 50, md: 60 }, // altura responsiva
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;