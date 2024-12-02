import { IconButton, InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, FC } from "react";
import classes from "./style.module.css";
import ClearIcon from "@mui/icons-material/Clear";

type PROP_TYPE = {
  label: string;
  error?: string;
  name?: string;
  value: string | number;
  type?: "text" | "date" | "number";
  disabled?: boolean;
  handleClear?: () => void;
  hasClearIcon?: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput: FC<PROP_TYPE> = ({
  label,
  value,
  hasClearIcon = false,
  handleChange,
  type = "text",
  disabled = false,
  name = "",
  error = "",
  handleClear,
}) => {
  return (
    <>
      <TextField
        type={type}
        name={name}
        fullWidth
        label={label}
        disabled={disabled}
        value={value}
        error={!!error}
        onChange={(event) => {
          !event.target.value.trim() && handleClear && handleClear();
          handleChange(event as any);
        }}
        className={classes.textInput}
        InputProps={{
          endAdornment:
            value && !disabled && hasClearIcon ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    handleClear && handleClear();
                  }}
                  sx={{ color: "#FFF" }} // Apply white color to the icon
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
        sx={{
          "& .MuiInputBase-input": {
            cursor: disabled ? "not-allowed" : "auto",
            color: disabled ? "grey" : "#FFF",
            WebkitTextFillColor: disabled ? "grey" : "#FFF",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: disabled ? "transparent" : "gray", // Default border color, transparent when disabled
            },
            "&:hover fieldset": {
              borderColor: disabled ? "transparent" : "#1976D2", // Border color on hover, transparent when disabled
            },
            "&.Mui-focused fieldset": {
              borderColor: disabled ? "transparent" : "#1976D2", // Border color when focused, transparent when disabled
            },
          },
          "& .MuiInputLabel-root": {
            color: "gray", // Placeholder color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#1976D2", // Placeholder color when focused
          },
          "& input[type='date']::-webkit-datetime-edit-text": {
            display: "none", // Hide the default 'dd/mm/yyyy' text
            opacity: 0,
          },
          "& input[type='date']::-webkit-datetime-edit": {
            color: "transparent", // Makes text completely invisible
          },
          "& input[type='date']::-webkit-calendar-picker-indicator": {
            color: "#1976D2", // Calendar icon color
            filter: "invert(40%) sepia(60%) saturate(500%) hue-rotate(200deg)", // Custom color effect
            cursor: "pointer", // Changes the cursor to pointer
          },
        }}
      />
      {error && (
        <span style={{ marginTop: "5px", color: "red", fontSize: "10px" }}>
          {error}
        </span>
      )}
    </>
  );
};

export default CustomInput;
