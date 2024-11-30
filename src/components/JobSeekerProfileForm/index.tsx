import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Container,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Autocomplete,
  TextField,
  Chip,
  CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import classes from "./style.module.css";
import CustomInput from "../CustomInput";
import { indianCities, skillsList } from "../../assets/data";
import FileUpload from "../FileUpload";
import AXIOS from "../../configs/axios.confog";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../../store/global/globalReducer";
import { notification } from "../../configs/notification.config";

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrent?: boolean;
}

interface Education {
  institution: string;
  degree: string;
  yearOfPassing: number;
}

interface Preferences {
  jobType?: string[];
  location?: string[];
}

const newExp = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
};

const newEducation = {
  institution: "",
  degree: "",
  yearOfPassing: new Date().getFullYear(),
};

const JobSeekerProfileForm: FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<Experience[]>([newExp]);
  const [education, setEducation] = useState<Education[]>([newEducation]);
  const [preferences, setPreferences] = useState<Preferences>({});
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState<null | number>(
    null
  );
  const [expType, setExpType] = useState<string>("fresher");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleAddExperience = () => {
    setExperience([...experience, newExp]);
  };

  const handleSkillsChange = (_: any, newValue: string[]) => {
    setSkills(newValue);
  };

  const handleLocationSelect = (_: any, newValue: string[]) => {
    setPreferences({ ...preferences, location: newValue });
  };

  const handleAddEducation = () => {
    setEducation([...education, newEducation]);
  };

  const handleExperienceChange = (
    key: keyof Experience,
    value: string | boolean,
    index: number
  ) => {
    const experienceCopy = JSON.parse(JSON.stringify(experience));
    experienceCopy[index][key] = value;
    setExperience(experienceCopy);
  };

  const handleEducationChange = (
    key: keyof Education,
    value: string | number,
    index: number
  ) => {
    const educationCopy = JSON.parse(JSON.stringify(education));
    educationCopy[index][key] = value;
    setEducation(educationCopy);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setGlobalLoading(true));
    setLoading(true);
    // Create a new FormData object to append all the fields
    const formData = new FormData();

    formData.append("skills", JSON.stringify(skills));
    formData.append("experience", JSON.stringify(experience));
    formData.append("education", JSON.stringify(education));
    formData.append("preferences", JSON.stringify(preferences));
    formData.append("expType", JSON.stringify(expType));

    // Append the file if available
    if (file) {
      formData.append("resume", file); // Assuming the input name is "resume"
    }

    try {
      // Send the FormData to the API
      await AXIOS.post("/profile/candidate/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      notification.success("Profile created successfully");
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
      dispatch(setGlobalLoading(false));
    }
  };

  const isDisabled = (index: number) => {
    if (currentCompanyIndex === null) {
      return false;
    }
    return currentCompanyIndex !== index;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExpType((event.target as HTMLInputElement).value);
  };

  const handleJobTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPreferences({
      ...preferences,
      [event.target.name]: (event.target as HTMLInputElement).value,
    });
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
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
        Create Your Profile
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3} padding={3}>
          {/* Skills */}
          <Autocomplete
            multiple
            id="skills-input"
            options={skillsList}
            value={skills}
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
          <FormControl>
            <Box display="flex" alignItems="center">
              <FormLabel id="demo-radio-buttons-group-label">
                <Typography
                  variant="h4"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: "#FFF" }}
                >
                  I am
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={expType}
                onChange={handleChange}
                sx={{ display: "flex", flexDirection: "row", ml: 2 }} // Add left margin to separate radio buttons
              >
                <FormControlLabel
                  value="fresher"
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
                  label="Fresher"
                />
                <FormControlLabel
                  value="experienced"
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
                  label="Experienced"
                />
              </RadioGroup>
            </Box>
          </FormControl>
          {/* Add Experience */}
          {expType === "experienced" && (
            <Box>
              <Typography variant="h4" gutterBottom>
                Experience
              </Typography>

              {experience.map((exp, index) => (
                <Stack spacing={2}>
                  <Box className={classes.experienceLine}>
                    <CustomInput
                      label="Company"
                      value={exp.company}
                      handleChange={(e) =>
                        handleExperienceChange("company", e.target.value, index)
                      }
                    />
                    <CustomInput
                      label="Role"
                      value={exp.role}
                      handleChange={(e) =>
                        handleExperienceChange("role", e.target.value, index)
                      }
                    />
                  </Box>
                  <Box className={classes.experienceLine}>
                    <CustomInput
                      type="date"
                      label="Start Date"
                      // InputLabelProps={{ shrink: true }}
                      value={exp.startDate}
                      handleChange={(e) =>
                        handleExperienceChange(
                          "startDate",
                          e.target.value,
                          index
                        )
                      }
                    />
                    <CustomInput
                      type={currentCompanyIndex === index ? "text" : "date"}
                      label="End Date"
                      // InputLabelProps={{ shrink: true }}
                      value={
                        currentCompanyIndex === index
                          ? "Current"
                          : exp.endDate ?? ""
                      }
                      disabled={currentCompanyIndex === index}
                      handleChange={(e) =>
                        handleExperienceChange("endDate", e.target.value, index)
                      }
                    />
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={isDisabled(index)}
                        checked={currentCompanyIndex === index}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleExperienceChange("endDate", "Current", index);
                            setCurrentCompanyIndex(index);
                          } else {
                            handleExperienceChange("endDate", "", index);
                            setCurrentCompanyIndex(null);
                          }
                        }}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            color: isDisabled(index)
                              ? "gray !important"
                              : "#1976D2", // Color of the checked tick
                          },
                          "&.Mui-checked": {
                            color: "#1976D2", // Color of the checked box (border)
                          },
                          "&.Mui-disabled": {
                            color: "#FFF", // Disabled state border color
                          },
                          "& .MuiCheckbox-root": {
                            borderColor: "gray", // Default border color
                          },
                          "&:hover": {
                            backgroundColor: "transparent", // Remove background on hover
                          },
                        }}
                      />
                    }
                    label="Current Company"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: isDisabled(index)
                          ? "gray !important"
                          : "inherit",
                      },
                    }}
                  />
                </Stack>
              ))}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddExperience}
              >
                Add Experience
              </Button>
            </Box>
          )}

          {/* Education Section */}
          <Box>
            <Typography variant="h4" gutterBottom>
              Education
            </Typography>

            {education.map((edu, index) => (
              <Stack spacing={2}>
                <CustomInput
                  label="Institution"
                  value={edu.institution}
                  handleChange={(e) =>
                    handleEducationChange("institution", e.target.value, index)
                  }
                />
                <CustomInput
                  label="Degree"
                  value={edu.degree}
                  handleChange={(e) =>
                    handleEducationChange("degree", e.target.value, index)
                  }
                />
                <CustomInput
                  type="number"
                  label="Year of Passing"
                  value={edu.yearOfPassing ?? ""}
                  handleChange={(e) =>
                    handleEducationChange(
                      "yearOfPassing",
                      +e.target.value,
                      index
                    )
                  }
                />
              </Stack>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddEducation}
              fullWidth
              sx={{ marginTop: "20px" }}
            >
              Add Education
            </Button>
          </Box>

          {/* Preferences Section */}
          <Box>
            <Typography variant="h4" gutterBottom>
              Preferences
            </Typography>
            {/* Add fields for preferences */}
            <Stack spacing={2}>
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
                    value={preferences.jobType}
                    onChange={handleJobTypeChange}
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
              <Autocomplete
                multiple
                id="location-input"
                options={indianCities}
                value={preferences.location}
                onChange={handleLocationSelect}
                disableCloseOnSelect
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location Preferences"
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
                      "& input[type='date']::-webkit-calendar-picker-indicator":
                        {
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
                acceptedFormats={["pdf"]}
                file={file}
              />
            </Stack>
          </Box>

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

export default JobSeekerProfileForm;
