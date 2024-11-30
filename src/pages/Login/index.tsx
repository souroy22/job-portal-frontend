import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import useForm from "../../hooks/useForm";
import TextInput from "../../components/TextInput";
import CustomButton from "../../components/CustomButton";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/user/userReducer";
import { login } from "../../api/auth.api";
import { customLocalStorage } from "../../utils/customLocalStorage";
import classes from "./style.module.css";
import handleAsync from "../../utils/handleAsync";

const formFields = [
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

const Login = () => {
  const { formData, errors, handleChange, handleSubmit, loading } =
    useForm(formFields);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = handleAsync(async (data: { [key: string]: string }) => {
    const userData = await login(data);
    customLocalStorage.setData("token", userData.token);
    dispatch(setUserData(userData.user));
    navigate("/");
  });

  return (
    <Box className={classes.loginFormContainer}>
      <h2 className={classes.title}>Login Form</h2>
      <form
        action="#"
        autoComplete="off"
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
          name="Login"
          loading={loading}
          type="submit"
          disabled={loading}
          variant="contained"
          fullWidth
          sx={{ backgroundColor: "#6c63ff" }}
          onClick={() => handleSubmit(handleLogin)}
        />
      </form>
      <span className={classes.navigate}>
        Click here to <Link to="/signup">signup</Link>
      </span>
    </Box>
  );
};

export default Login;
