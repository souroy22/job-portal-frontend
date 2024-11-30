import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import useForm from "../../hooks/useForm";
import TextInput from "../../components/TextInput";
import CustomButton from "../../components/CustomButton";
import { notification } from "../../configs/notification.config";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/user/userReducer";
import { FaUser } from "react-icons/fa";
import { signup } from "../../api/auth.api";
import { customLocalStorage } from "../../utils/customLocalStorage";
import classes from "./style.module.css";

const formFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    StartIcon: FaUser,
    validation: (value: string) =>
      value.length >= 3 ? null : "Name must be at least 3 characters long",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    StartIcon: MdOutlineAlternateEmail,
    validation: (value: string) =>
      /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    StartIcon: RiLockPasswordFill,
    validation: (value: string) =>
      value.length >= 6 ? null : "Password must be at least 6 characters long",
  },
];

const Signup = () => {
  const { formData, errors, handleChange, handleSubmit, loading } =
    useForm(formFields);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (data: { [key: string]: string }) => {
    try {
      const userData = await signup(data);
      customLocalStorage.setData("token", userData.token);
      dispatch(setUserData(userData.user));
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  return (
    <Box className={classes.signupFormContainer}>
      <h2 className={classes.title}>Signup Form</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        {formFields.map((field) => (
          <TextInput
            key={field.name}
            name={field.name}
            type={field.type}
            required={field.required}
            StartIcon={field.StartIcon}
            onChange={handleChange}
            placeholder={field.label}
            value={formData[field.name]}
            error={errors[field.name]}
          />
        ))}
        <CustomButton
          name="Sign up"
          loading={loading}
          disabled={loading}
          type="submit"
          variant="contained"
          fullWidth
          sx={{ backgroundColor: "#6C63FF" }}
          onClick={() => handleSubmit(handleSignup)}
        />
      </form>
      <span className={classes.navigate}>
        Click here to <Link to="/signin">login</Link>
      </span>
    </Box>
  );
};

export default Signup;
