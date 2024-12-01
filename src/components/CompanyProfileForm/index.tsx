import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import classes from "./style.module.css";
import { ChangeEvent, FormEvent, useState } from "react";
import CustomInput from "../CustomInput";
import { indianCities } from "../../assets/data";
import FileUpload from "../FileUpload";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoading } from "../../store/global/globalReducer";
import AXIOS from "../../configs/axios.confog";
import { notification } from "../../configs/notification.config";
import { setUserData } from "../../store/user/userReducer";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

type FORM_DATA_TYPE = {
  name: string;
  description: string;
  industry: string;
  website: string;
  location: string[];
};

const CompanyProfileForm = () => {
  const [formData, setFormData] = useState<FORM_DATA_TYPE>({
    name: "",
    description: "",
    industry: "",
    website: "",
    location: [],
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setGlobalLoading(true));
    setLoading(true);
    // Create a new FormData object to append all the fields
    const companyFormData = new FormData();

    // Append form data fields (skills, experience, education, preferences)
    companyFormData.append("name", JSON.stringify(formData.name)); // Convert to JSON string to send as an array
    companyFormData.append("description", JSON.stringify(formData.description)); // Convert to JSON string to send as an array
    companyFormData.append("industry", JSON.stringify(formData.industry)); // Convert to JSON string to send as an array
    companyFormData.append("website", JSON.stringify(formData.website)); // Convert to JSON string to send as an object
    companyFormData.append("location", JSON.stringify(formData.location)); // Experience type (fresher, etc.)

    // Append the file if available
    if (file) {
      companyFormData.append("logo", file); // Assuming the input name is "resume"
    }

    try {
      // Send the FormData to the API
      await AXIOS.post("/profile/company/create", companyFormData, {
        headers: {
          "Content-Type": "multipart/form-data", // Optional: Axios automatically sets this header, but you can specify it if needed
        },
      });
      const newUser = JSON.parse(JSON.stringify(user));
      dispatch(setUserData({ ...newUser, finishedProfile: true }));
      notification.success("Profile created successfully");
      navigate("/all-jobs");
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
      dispatch(setGlobalLoading(false));
    }
  };

  const handleLocationSelect = (_: any, newValue: string[]) => {
    setFormData({ ...formData, location: newValue });
  };

  return (
    <Container maxWidth="md" className={classes.jobSeekerForm}>
      <Typography
        variant="h3"
        fontWeight={700}
        color="#FFF"
        textAlign="center"
        marginBottom="20px"
        className={classes.textGlow}
      >
        Create Company Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} padding={3}>
          <CustomInput
            name="name"
            label="Company Name"
            value={formData.name}
            handleChange={handleChange}
          />
          <CustomInput
            name="description"
            label="Company Description"
            value={formData.description}
            handleChange={handleChange}
          />
          <CustomInput
            name="industry"
            label="Industry Type"
            value={formData.industry}
            handleChange={handleChange}
          />
          <CustomInput
            name="website"
            label="Website Url"
            value={formData.website}
            handleChange={handleChange}
          />
          <Autocomplete
            multiple
            id="location-input"
            options={indianCities}
            value={formData.location}
            onChange={handleLocationSelect}
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField
                {...params}
                label="Company Locations"
                variant="outlined"
                placeholder="Add skills"
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    color: "#FFF", // Text color
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "gray", // Default border color, transparent when disabled
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976D2", // Border color on hover, transparent when disabled
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976D2", // Border color when focused, transparent when disabled
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
                    filter:
                      "invert(40%) sepia(60%) saturate(500%) hue-rotate(200deg)", // Custom color effect
                    cursor: "pointer", // Changes the cursor to pointer
                  },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  color="primary"
                  sx={{
                    margin: "4px",
                    borderColor: "gray", // Chip border color
                  }}
                />
              ))
            }
          />
          <FileUpload
            onFileChange={handleFileChange}
            acceptedFormats={["image"]}
            file={file}
            placeHolder="Select Company image"
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: loading ? "#676767 !important" : undefined,
            }}
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
              "Create Company"
            )}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default CompanyProfileForm;
