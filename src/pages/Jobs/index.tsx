import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import CustomInput from "../../components/CustomInput";
import classes from "./style.module.css";
import { indianCities, jobTypes } from "../../assets/data";
import JobCard from "../../components/JobCard";
import { getAllJobs } from "../../api/job.api";
import { useDispatch, useSelector } from "react-redux";
import { setJobs } from "../../store/job/jobReducer";
import { RootState } from "../../store/store";
import { setGlobalLoading } from "../../store/global/globalReducer";
import CustomAutocomplete, {
  OPTION_TYPE,
} from "../../components/CustomAutoComplete";

const Jobs = () => {
  const [searchValue, setSearchValue] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<null | {
    label: string;
    value: string;
  }>(null);

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
    value: OPTION_TYPE | OPTION_TYPE[] | null
  ) => {
    if (value) {
      setLocation(value as string);
      await fetchJobs(searchValue, value as string, selectedJobTypes?.value);
    }
  };

  const handleSelectType = async (
    _: SyntheticEvent<Element, Event>,
    value: OPTION_TYPE | OPTION_TYPE[] | null
  ) => {
    if (value) {
      setSelectedJobTypes(value as { label: string; value: string });
      await fetchJobs(
        searchValue,
        location,
        (value as { label: string; value: string }).value
      );
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
              <CustomAutocomplete
                id="location-input"
                options={indianCities}
                value={location}
                onChange={handleSelectLocation}
                label="Location"
                multiple={false}
                placeholder="Select Location"
              />
              <CustomAutocomplete
                id="jobTypes-input"
                options={jobTypes}
                value={selectedJobTypes}
                onChange={handleSelectType}
                label="Job Types"
                multiple={false}
                placeholder="Add skills"
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
        {!jobs?.length ? (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" color="gray">
              No Data found
            </Typography>
          </Box>
        ) : (
          jobs?.map((job) => (
            <JobCard
              title={job.title}
              location={job.location}
              description={job.description}
              logo={job.logo}
              jobId={job.id}
              applied={job.applied}
            />
          ))
        )}
      </Box>
    </Container>
  );
};

export default Jobs;
