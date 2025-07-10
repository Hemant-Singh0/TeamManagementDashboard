import { useState } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MDBox from "../../utils/MDBox";
import MDTypography from "../../utils/MDTypography";
import MDInput from "../../utils/MDInput";
import MDButton from "../../utils/MDButton";
import BasicLayout from "../../utils/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useNavigate, Link } from "react-router-dom";
import URL from "../../config/configuration_keys.json";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Register() {
  const url = URL.REACT_APP_API_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [success, setSuccess] = useState("");

  const validate = () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.includes(" ")) {
      setPasswordError("Password cannot contain spaces");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    if (password.trim()) {
      if (!confirmPassword.trim()) {
        setConfirmPasswordError("Confirm Password is required");
        valid = false;
      } else if (confirmPassword.includes(" ")) {
        setConfirmPasswordError("Confirm Password cannot contain spaces");
        valid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        valid = false;
      }
    }

    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Registration failed");
      setSuccess("Registration successful! Redirecting to login...");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError("");
    setSuccess("");
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={0}>
            Register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleRegister}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
              />
            </MDBox>
            {nameError && (
              <MDTypography
                variant="caption"
                color="error"
                display="block"
                sx={{ mt: "-8px", ml: "5px", mb: "15px" }}
              >
                {nameError}
              </MDTypography>
            )}
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
            </MDBox>
            {emailError && (
              <MDTypography
                variant="caption"
                color="error"
                display="block"
                sx={{ mt: "-8px", ml: "5px", mb: "15px" }}
              >
                {emailError}
              </MDTypography>
            )}
            <MDBox mb={2}>
              <MDInput
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            {passwordError ? (
              <MDTypography
                variant="caption"
                color="error"
                display="block"
                sx={{ mt: "-8px", ml: "5px", mb: "15px" }}
              >
                {passwordError}
              </MDTypography>
            ) : (
              <MDTypography
                variant="caption"
                color="text"
                display="block"
                sx={{ mt: "-8px", ml: "5px", mb: "15px" }}
              >
                At least 6 characters, no spaces.
              </MDTypography>
            )}

            <MDBox mb={2}>
              <MDInput
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            {confirmPasswordError && (
              <MDTypography
                variant="caption"
                color="error"
                display="block"
                sx={{ mt: "-8px", ml: "5px", mb: "15px" }}
              >
                {confirmPasswordError}
              </MDTypography>
            )}
            <MDBox mt={2} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={loading}
                sx={{ position: "relative" }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Register"
                )}
              </MDButton>
            </MDBox>
            <MDBox textAlign="center" mt={0}>
              <MDTypography
                component={Link}
                to="/login"
                variant="button"
                color="info"
                fontWeight="medium"
                sx={{ display: "block", textAlign: "center", mt: 2 }}
              >
                Already have an account? Sign In
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {error ? (
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{
              width: "100%",
              fontWeight: "bold",
              bgcolor: "#f44336",
              color: "#fff",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        ) : success ? (
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{
              width: "100%",
              fontWeight: "bold",
              bgcolor: "#4caf50",
              color: "#fff",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>
        ) : null}
      </Snackbar>
    </BasicLayout>
  );
}

export default Register;
