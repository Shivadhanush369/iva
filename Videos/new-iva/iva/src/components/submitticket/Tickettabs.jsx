import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Schedulersui from '../Schedulers/Schedulersui';
import SubmitTicket from './SubmitTicket';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 4 }}>{/* Increase padding */}
          {children}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Tickettabs({rows,togfunc}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              borderBottom: 2,
              borderColor: 'primary.main',
              mb: 2, // Add margin below the tabs
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{
                '& .MuiTab-root': { fontSize: '1.2rem', fontWeight: 'bold', py: 2 }, // Larger tabs with padding
              }}
            >
              <Tab label="Jira" {...a11yProps(0)} />
              <Tab label="Otrs" {...a11yProps(1)} disabled/>
              <Tab label="Service Now" {...a11yProps(2)} disabled/>
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <SubmitTicket togfunc={togfunc}row={rows}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Schedulersui />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Box>
              {/* Content for Item Three */}
            </Box>
          </CustomTabPanel>
        </Box>
      </CardContent>
    </Card>
  );
}
