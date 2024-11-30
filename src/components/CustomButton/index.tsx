import { CSSProperties, FC, MouseEvent } from "react";
import { Button, CircularProgress } from "@mui/material";

type PropTypes = {
  loading?: boolean;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  variant?: "contained" | "outlined" | "text";
  disabled?: boolean;
  fullWidth?: boolean;
  name: string;
  sx?: CSSProperties;
  className?: string;
  width?: number | string;
  height?: number | string;
};

const CustomButton: FC<PropTypes> = ({
  loading,
  type = "button",
  onClick,
  variant = "contained",
  disabled = false,
  name,
  sx = {},
  className = "",
  width = 250,
  height = 50,
  fullWidth = false,
}) => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (loading) return;
    onClick && onClick();
  };

  return (
    <Button
      type={type}
      variant={variant}
      className={className}
      disabled={disabled}
      onClick={handleClick}
      sx={{
        width: fullWidth ? null : width,
        height,
        ...sx,
        backgroundColor: disabled ? "#676767 !important" : undefined,
      }}
      fullWidth={fullWidth}
    >
      {loading ? (
        <CircularProgress
          sx={{
            color: "white",
            width: "25px !important",
            height: "25px !important",
          }}
        />
      ) : (
        <>{name}</>
      )}
    </Button>
  );
};

export default CustomButton;
