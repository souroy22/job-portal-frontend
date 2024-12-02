import {
  Button,
  CircularProgress,
  Container,
  Stack,
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
import CustomAutocomplete, { OPTION_TYPE } from "../CustomAutoComplete";

type FORM_DATA_TYPE = {
  name: string;
  description: string;
  industry: string;
  website: string;
  location: string[];
};

type ERROR_TYPE = {
  [key in keyof FORM_DATA_TYPE]?: string;
};

const CompanyProfileForm = () => {
  const [formData, setFormData] = useState<FORM_DATA_TYPE>({
    name: "",
    description: "",
    industry: "",
    website: "",
    location: [],
  });
  const [errors, setErrors] = useState<ERROR_TYPE>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateField = (
    name: keyof FORM_DATA_TYPE,
    value: string | string[]
  ) => {
    if (
      name === "website" &&
      value &&
      !/^https?:\/\/[^\s]+$/i.test(value as string)
    ) {
      return "Invalid website URL.";
    }
    if (name === "name" && !(value as string).trim()) {
      return "Company name is required.";
    }
    if (name === "description" && (value as string).trim().length < 10) {
      return "Description should be at least 10 characters long.";
    }
    if (name === "industry" && !(value as string).trim()) {
      return "Industry type is required.";
    }
    if (name === "location" && (!value || (value as string[]).length === 0)) {
      return "At least one location must be selected.";
    }
    return "";
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const validateForm = () => {
    const newErrors: ERROR_TYPE = {};
    for (const key in formData) {
      const error = validateField(
        key as keyof FORM_DATA_TYPE,
        formData[key as keyof FORM_DATA_TYPE]
      );
      if (error) {
        newErrors[key as keyof FORM_DATA_TYPE] = error;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(setGlobalLoading(true));
    setLoading(true);
    const companyFormData = new FormData();

    companyFormData.append("name", JSON.stringify(formData.name)); // Convert to JSON string to send as an array
    companyFormData.append("description", JSON.stringify(formData.description)); // Convert to JSON string to send as an array
    companyFormData.append("industry", JSON.stringify(formData.industry)); // Convert to JSON string to send as an array
    companyFormData.append("website", JSON.stringify(formData.website)); // Convert to JSON string to send as an object
    companyFormData.append("location", JSON.stringify(formData.location)); // Experience type (fresher, etc.)

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
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
      dispatch(setGlobalLoading(false));
    }
  };

  const handleLocationSelect = (
    _: any,
    newValue: OPTION_TYPE | OPTION_TYPE[] | null
  ) => {
    setFormData({ ...formData, location: newValue as string[] });
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
            error={errors.name}
          />
          <CustomInput
            name="description"
            label="Company Description"
            value={formData.description}
            handleChange={handleChange}
            error={errors.description}
          />
          <CustomInput
            name="industry"
            label="Industry Type"
            value={formData.industry}
            handleChange={handleChange}
            error={errors.industry}
          />
          <CustomInput
            name="website"
            label="Website Url"
            value={formData.website}
            handleChange={handleChange}
            error={errors.website}
          />
          <CustomAutocomplete
            id="location-input"
            options={indianCities}
            value={formData.location!}
            onChange={handleLocationSelect}
            label="Company Preferences"
            multiple
            placeholder="Select Company Location"
            error={errors.location}
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
