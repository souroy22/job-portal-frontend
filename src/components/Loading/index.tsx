import { Backdrop } from "@mui/material";

const Loading = ({ open }: { open: boolean }) => {
  return (
    <Backdrop open={open} sx={{ zIndex: 9999 }}>
      <img
        src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
        width="200px"
        height="200px"
      />
    </Backdrop>
  );
};

export default Loading;
