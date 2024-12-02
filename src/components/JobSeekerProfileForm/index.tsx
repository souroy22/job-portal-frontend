import { ChangeEvent, FC, FormEvent, useState } from "react";
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
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import classes from "./style.module.css";
import CustomInput from "../CustomInput";
import { indianCities, skillsList } from "../../assets/data";
import FileUpload from "../FileUpload";
import AXIOS from "../../configs/axios.confog";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoading } from "../../store/global/globalReducer";
import { notification } from "../../configs/notification.config";
import { setUserData } from "../../store/user/userReducer";
import { RootState } from "../../store/store";
import CustomAutocomplete, { OPTION_TYPE } from "../CustomAutoComplete";

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
  jobType?: string;
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
  const [preferences, setPreferences] = useState<Preferences>({
    jobType: "Full-time",
    location: [],
  });
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState<null | number>(
    null
  );
  const [expType, setExpType] = useState<string>("fresher");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    skills: "",
    experience: "",
    education: "",
    preferences: "",
    file: "",
  });

  const { user } = useSelector((state: RootState) => state.userReducer);

  const dispatch = useDispatch();

  const handleAddExperience = () => {
    setExperience([...experience, newExp]);
  };

  const validateForm = () => {
    const newErrors: any = {};
    let valid = true;

    // Validate Skills
    if (skills.length === 0) {
      newErrors.skills = "Skills are required.";
      valid = false;
    }

    // Validate Experience
    if (expType !== "fresher") {
      for (const exp of experience) {
        if (!exp.company || !exp.role || !exp.startDate) {
          newErrors.experience =
            "Company, Role, and Start Date are required for each experience.";
          valid = false;
          break;
        }
      }
    }
    // Validate Education
    for (const edu of education) {
      if (!edu.institution || !edu.degree || !edu.yearOfPassing) {
        newErrors.education =
          "Institution, Degree, and Year of Passing are required for each education.";
        valid = false;
        break;
      }
    }

    // Validate Preferences
    if (!preferences.jobType || !preferences.location) {
      newErrors.preferences = "Job Type and Location preferences are required.";
      valid = false;
    }

    setErrors(newErrors);
    console.log("newErrors", newErrors);

    return valid;
  };

  const handleSkillsChange = (
    _: any,
    newValue: OPTION_TYPE | OPTION_TYPE[] | null
  ) => {
    setSkills(newValue as string[]);
  };

  const handleLocationSelect = (
    _: any,
    newValue: OPTION_TYPE | OPTION_TYPE[] | null
  ) => {
    setPreferences({ ...preferences, location: newValue as string[] });
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
    if (!validateForm()) {
      return;
    }
    if (!file) {
      notification.error("Please select your resume");
      return;
    }
    dispatch(setGlobalLoading(true));
    setLoading(true);
    // Create a new FormData object to append all the fields
    const formData = new FormData();

    formData.append("skills", JSON.stringify(skills));
    formData.append("experience", JSON.stringify(experience));
    formData.append("education", JSON.stringify(education));
    formData.append("preferences", JSON.stringify(preferences));
    formData.append("expType", JSON.stringify(expType));

    if (file) {
      formData.append("resume", file);
    }

    try {
      // Send the FormData to the API
      await AXIOS.post("/profile/candidate/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setUserData({ ...(user as any), finishedProfile: true }));
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
          <CustomAutocomplete
            id="skills-input"
            options={skillsList}
            value={skills}
            onChange={handleSkillsChange}
            label="Skills"
            multiple
            placeholder="Add skills"
            error={errors.skills}
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
                  {errors.experience && (
                    <FormHelperText error>{errors.experience}</FormHelperText>
                  )}
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
            {errors.education && (
              <FormHelperText error>{errors.education}</FormHelperText>
            )}
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
              <CustomAutocomplete
                id="location-input"
                options={indianCities}
                value={preferences.location!}
                onChange={handleLocationSelect}
                label="Location Preferences"
                multiple
                placeholder="Select Preffered Location"
              />
              {errors.preferences && (
                <FormHelperText error>{errors.preferences}</FormHelperText>
              )}

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
