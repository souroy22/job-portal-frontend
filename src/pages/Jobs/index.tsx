import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CustomInput from "../../components/CustomInput";
import classes from "./style.module.css";
import { indianCities, jobTypes } from "../../assets/data";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import JobCard from "../../components/JobCard";
import { getAllJobs } from "../../api/job.api";
import { useDispatch, useSelector } from "react-redux";
import { setJobs } from "../../store/job/jobReducer";
import { RootState } from "../../store/store";
import { setGlobalLoading } from "../../store/global/globalReducer";

const Jobs = () => {
  const [searchValue, setSearchValue] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<null | {
    label: string;
    value: string;
  }>(null);
  const [open, setOpen] = useState(false);

  const { jobs } = useSelector((state: RootState) => state.jobReducer);

  const dispatch = useDispatch();

  const fetchJobs = async (
    value: string = "",
    location: string = "",
    jobType: string = ""
  ) => {
    const allJobs = await getAllJobs(value, location, jobType);
    dispatch(setJobs(allJobs.data));
  };

  const handleClear = () => {
    setSearchValue("");
    fetchJobs("", location, selectedJobTypes?.value);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const search = () => {
    fetchJobs(searchValue, location, selectedJobTypes?.value);
  };

  const handleSelectLocation = async (
    _: SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    if (value) {
      setLocation(value);
      await fetchJobs(searchValue, value, selectedJobTypes?.value);
    }
  };

  const handleSelectType = async (
    _: SyntheticEvent<Element, Event>,
    value: { label: string; value: string } | null
  ) => {
    if (value) {
      setSelectedJobTypes(value);
      await fetchJobs(searchValue, location, value.value);
    }
  };

  const onLoad = async () => {
    dispatch(setGlobalLoading(true));
    await fetchJobs();
    dispatch(setGlobalLoading(false));
  };

  const handleClearFilters = async () => {
    setLocation("");
    setSelectedJobTypes(null);
    await fetchJobs(searchValue);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{ overflowY: "hidden", height: "calc(100svh - 120px)" }}
    >
      <Typography
        variant="h3"
        fontWeight={700}
        color="#FFF"
        textAlign="center"
        marginBottom="20px"
        className={classes.textGlow}
      >
        ALL JOBS
      </Typography>
      {/* Filters */}
      <Box>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", gap: "20px" }}>
            <CustomInput
              label="search..."
              value={searchValue}
              handleChange={handleSearchChange}
              hasClearIcon
              handleClear={handleClear}
            />
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              onClick={search}
            >
              Search
            </Button>
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: "20px" }}>
              <Autocomplete
                id="location-input"
                fullWidth
                options={indianCities}
                value={location}
                onChange={handleSelectLocation}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                disableCloseOnSelect
                popupIcon={null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location"
                    variant="outlined"
                    placeholder="Select Location"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {params.InputProps.endAdornment}
                          <InputAdornment position="end">
                            {open ? (
                              <ExpandLess
                                sx={{ color: "#FFF", cursor: "pointer" }}
                              />
                            ) : (
                              <ExpandMore
                                sx={{ color: "#FFF", cursor: "pointer" }}
                              />
                            )}
                          </InputAdornment>
                        </>
                      ),
                    }}
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
              />
              <Autocomplete
                id="jobTypes-input"
                options={jobTypes}
                fullWidth
                value={selectedJobTypes}
                onChange={handleSelectType}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                disableCloseOnSelect
                popupIcon={null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Types"
                    variant="outlined"
                    placeholder="Add skills"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {params.InputProps.endAdornment}
                          <InputAdornment position="end">
                            {open ? (
                              <ExpandLess
                                sx={{ color: "#FFF", cursor: "pointer" }}
                              />
                            ) : (
                              <ExpandMore
                                sx={{ color: "#FFF", cursor: "pointer" }}
                              />
                            )}
                          </InputAdornment>
                        </>
                      ),
                    }}
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
              />
              <Button
                variant="contained"
                color="error"
                sx={{ width: "350px" }}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Jobs */}
      <Box className={classes.jobListContainer}>
        {jobs?.map((job) => (
          <JobCard
            title={job.title}
            location={job.location}
            description={job.description}
            logo={job.logo}
            jobId={job.id}
            applied={job.applied}
          />
        ))}
      </Box>
    </Container>
  );
};

export default Jobs;
