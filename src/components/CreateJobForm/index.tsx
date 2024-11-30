import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import classes from "./style.module.css";
import {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import CustomInput from "../CustomInput";
import { skillsList } from "../../assets/data";
import { getCompanyDetails } from "../../api/company.api";
import { createJob } from "../../api/job.api";
import { useNavigate } from "react-router-dom";

type FORM_DATA_TYPE = {
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: string;
  salary: number;
  skills: string[];
};

const CreateJobForm = () => {
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [companySlug, setCompanySlug] = useState<null | string>(null);
  const [formData, setFormData] = useState<FORM_DATA_TYPE>({
    title: "",
    description: "",
    company: "",
    location: "",
    jobType: "",
    skills: [],
    salary: 0,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSkillsChange = (_: any, newValue: string[]) => {
    setFormData({ ...formData, skills: newValue });
  };

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const data = JSON.parse(JSON.stringify(formData));
    delete data["company"];
    try {
      await createJob({ ...formData, companySlug });
    } finally {
      setLoading(false);
    }
    navigate("/posted-jobs");
  };

  const handleLocationSelect = (
    _: SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    setFormData({ ...formData, location: value ?? "" });
  };

  const onLoad = async () => {
    const company = await getCompanyDetails();
    setLocationOptions(company.location);
    setCompanySlug(company.slug);
    setFormData({ ...formData, company: company.name });
  };

  useEffect(() => {
    onLoad();
  }, []);

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
        Create New Job
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} padding={3}>
          <CustomInput
            name="title"
            label="Profile Name"
            value={formData.title}
            handleChange={handleChange}
          />
          <CustomInput
            name="description"
            label="Job Description"
            value={formData.description}
            handleChange={handleChange}
          />
          <FormControl>
            <Box display="flex" alignItems="center">
              <FormLabel id="demo-radio-buttons-group-label">
                <Typography
                  variant="h5"
                  fontWeight={500}
                  gutterBottom
                  sx={{ color: "#FFF" }}
                >
                  Job Type
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                sx={{ display: "flex", flexDirection: "row", ml: 2 }} // Add left margin to separate radio buttons
              >
                <FormControlLabel
                  value="Full-time"
                  control={
                    <Radio
                      sx={{
                        color: "#FFF", // Radio button color when not selected
                        "&.Mui-checked": {
                          color: "#1976D2", // Color when the radio button is selected
                        },
                        "&.MuiRadio-root": {
                          borderColor: "#FFF", // Border color of the radio button
                        },
                      }}
                    />
                  }
                  label="Full Time"
                />
                <FormControlLabel
                  value="Part-time"
                  control={
                    <Radio
                      sx={{
                        color: "#FFF", // Radio button color when not selected
                        "&.Mui-checked": {
                          color: "#1976D2", // Color when the radio button is selected
                        },
                        "&.MuiRadio-root": {
                          borderColor: "#FFF", // Border color of the radio button
                        },
                      }}
                    />
                  }
                  label="Part Time"
                />
                <FormControlLabel
                  value="Contract"
                  control={
                    <Radio
                      sx={{
                        color: "#FFF", // Radio button color when not selected
                        "&.Mui-checked": {
                          color: "#1976D2", // Color when the radio button is selected
                        },
                        "&.MuiRadio-root": {
                          borderColor: "#FFF", // Border color of the radio button
                        },
                      }}
                    />
                  }
                  label="Contract"
                />
              </RadioGroup>
            </Box>
          </FormControl>
          <CustomInput
            name="company"
            disabled
            label="Company Name"
            value={formData.company}
            handleChange={handleChange}
          />
          <CustomInput
            name="salary"
            type="number"
            label="Salary (in CTC)"
            value={formData.salary}
            handleChange={handleChange}
          />
          <Autocomplete
            id="location-input"
            options={locationOptions}
            value={formData.location}
            onChange={handleLocationSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Job Location"
                variant="outlined"
                placeholder="Job Location"
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

          <Autocomplete
            multiple
            id="skills-input"
            options={skillsList}
            value={formData.skills}
            onChange={handleSkillsChange}
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField
                {...params}
                label="Skills"
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
              "Submit Profile"
            )}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default CreateJobForm;
