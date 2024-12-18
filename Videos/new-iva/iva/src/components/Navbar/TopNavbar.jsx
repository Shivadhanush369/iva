import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaHome, FaUser } from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { BiAnalyse, BiSearch, BiCog } from 'react-icons/bi';
import { AiFillHeart, AiTwotoneFileExclamation } from 'react-icons/ai';
import { BsCartCheck } from 'react-icons/bs';
import { NavLink, Outlet } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { centerImage } from 'highcharts';

let pages = [];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// Navbar Component
function TopNavbar({content}) {
    pages =[];
    pages.push(content);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="fixed" sx={{ zIndex: 999 ,backgroundColor:'#00073D'}}>
      <Container  maxWidth="xl"
  sx={{
    color:'white',
    height: '56px', // Explicit height for Container
 // Vertically center content
 m: 0
  }}>
        <Toolbar     >
          {/* Logo */}
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' } ,mb:1 }} />
          <Typography
            variant="h6"
            component="a"
            href="#"
            sx={{
              mb: 1,
              display: 'flex',
              textAlign:'center',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
              color: 'white',
            }}
          >
            iVA
          </Typography>

          {/* Mobile View */}
          <Box sx={{ display: { xs: 'flex', md: 'none' },justifyContent:'center', flexGrow: 1 }}>
            <IconButton size="large" color="#00073D" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
           

            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="right">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' },justifyContent:'center' ,fontSize:'18px',fontWeight:'bold'}}>
            {pages.map((page) => (
              <Button key={page} sx={{ my: 0, color: 'white', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>

          {/* Profile Menu */}
          <Box sx={{ flexGrow: 0 ,marginRight:'-30px'}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default TopNavbar;