import { Box, Tooltip } from "@mui/material";
import { IconType } from "react-icons";
import "./style.css";
import { ChangeEvent, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

type PropTypes = {
  type: string;
  placeholder: string;
  name: string;
  error?: string | null;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  StartIcon?: IconType | null;
  value: string;
  onChange: (name: string, value: string) => void;
};

const TextInput = ({
  type = "text",
  placeholder,
  name,
  error = null,
  required = false,
  StartIcon = null,
  value,
  onChange,
}: PropTypes) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(name, event.target.value);
  };

  return (
    <>
      <Box
        className={`input-field ${type === "password" ? "with-end-icon" : ""}`}
      >
        {StartIcon && (
          <Box className="start-icon">
            <StartIcon />
          </Box>
        )}
        <input
          name={name}
          value={value}
          onChange={handleChange}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={`${placeholder}${required ? "*" : ""}`}
          autoComplete="off"
        />
        {type === "password" && (
          <Tooltip title={`Click to ${showPassword ? "hide" : "show"}`}>
            <Box className="end-icon">
              {showPassword ? (
                <FaRegEye onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <FaRegEyeSlash onClick={() => setShowPassword(!showPassword)} />
              )}
            </Box>
          </Tooltip>
        )}
      </Box>

      {error && <span className="error-message">{error}</span>}
    </>
  );
};

export default TextInput;
