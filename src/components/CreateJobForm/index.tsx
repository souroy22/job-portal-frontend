import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
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
import MDEditor from "@uiw/react-md-editor";
import CustomAutocomplete, { OPTION_TYPE } from "../CustomAutoComplete";

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

  const handleSkillsChange = (
    _: any,
    newValue: OPTION_TYPE | OPTION_TYPE[] | null
  ) => {
    setFormData({ ...formData, skills: newValue as string[] });
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
    value: OPTION_TYPE | OPTION_TYPE[] | null
  ) => {
    setFormData({ ...formData, location: (value as string) ?? "" });
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
          <MDEditor
            value={formData.description}
            onChange={(val) => {
              console.log("Value", val);

              setFormData({ ...formData, description: val as string });
            }}
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
          <CustomAutocomplete
            id="location-input"
            options={locationOptions}
            value={formData.location}
            onChange={handleLocationSelect}
            label="Job Location"
            multiple={false}
            placeholder="Job Location"
          />
          <CustomAutocomplete
            id="skills-input"
            options={skillsList}
            value={formData.skills}
            onChange={handleSkillsChange}
            label="Skills"
            multiple
            placeholder="Add skills"
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
