import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Tickettabs from '../submitticket/Tickettabs';
import zIndex from '@mui/material/styles/zIndex';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  height : 600,
  p: 2,
  zIndex:-1
};

export default function BasicModal({children,row,togfunc}) {
  console.log("basicmodal "+ JSON.stringify(row))
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div onClick={handleOpen}>{children}</div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Tickettabs togfunc={togfunc} rows={row}/>
        </Box>
      </Modal>
    </div>
  );
}