import React from "react";
import { Autocomplete, TextField, Chip, InputAdornment } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { autoCommpleteStyle } from "../../assets/data";

export type OPTION_TYPE = string | { label: string; value: string };

type CustomAutocompleteProps = {
  id: string;
  options: OPTION_TYPE[];
  value: OPTION_TYPE | OPTION_TYPE[] | null;
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: OPTION_TYPE | OPTION_TYPE[] | null
  ) => void;
  label: string;
  placeholder?: string;
  multiple?: boolean;
  disableCloseOnSelect?: boolean;
  showCustomIcon?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  sx?: object;
};

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  id,
  options,
  value,
  onChange,
  label,
  placeholder = "",
  multiple = false,
  disableCloseOnSelect = false,
  showCustomIcon = false,
  open = false,
  setOpen,
  sx = {},
}) => {
  const normalizeOption = (option: OPTION_TYPE): string =>
    typeof option === "string" ? option : option.label;

  return (
    <Autocomplete
      id={id}
      fullWidth
      options={options}
      getOptionLabel={(option) => normalizeOption(option)}
      value={value}
      onChange={onChange}
      multiple={multiple}
      disableCloseOnSelect={disableCloseOnSelect}
      popupIcon={showCustomIcon ? null : undefined}
      onOpen={showCustomIcon && setOpen ? () => setOpen(true) : undefined}
      onClose={showCustomIcon && setOpen ? () => setOpen(false) : undefined}
      sx={autoCommpleteStyle}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          placeholder={placeholder}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
                <InputAdornment position="end">
                  {open ? (
                    <ExpandLess sx={{ color: "#FFF", cursor: "pointer" }} />
                  ) : (
                    <ExpandMore sx={{ color: "#FFF", cursor: "pointer" }} />
                  )}
                </InputAdornment>
              </>
            ),
          }}
          sx={sx}
        />
      )}
      renderTags={(value, getTagProps) =>
        multiple && Array.isArray(value)
          ? value.map((option: OPTION_TYPE, index: number) => (
              <Chip
                label={normalizeOption(option)}
                {...getTagProps({ index })}
                color="primary"
                sx={{ margin: "4px", borderColor: "gray" }}
              />
            ))
          : null
      }
    />
  );
};

export default CustomAutocomplete;
