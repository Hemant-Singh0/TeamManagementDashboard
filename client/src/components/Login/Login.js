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
import { useNavigate } from "react-router-dom";
import URL from "../../config/configuration_keys.json";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function Basic() {
  const url = URL.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Login failed");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", result.user.name);
      localStorage.setItem("userID", result.user.id);
      localStorage.setItem("userRole", result.user.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  if (value.trim() !== "") {
                    setEmailError("");
                  }
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
                  const value = e.target.value;
                  setPassword(value);
                  if (value.trim() !== "") {
                    setPasswordError("");
                  }
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
            {passwordError && (
              <MDTypography
                variant="caption"
                color="error"
                display="block"
                sx={{ mt: "-8px", ml: "5px" }}
              >
                {passwordError}
              </MDTypography>
            )}
            {error && (
              <MDTypography variant="caption" color="error" display="block">
                {error}
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
                  "Sign In"
                )}
              </MDButton>
            </MDBox>
          </MDBox>
          <MDBox textAlign="center" mt={0}>
            <MDTypography
              component={Link}
              to="/register"
              variant="button"
              color="info"
              fontWeight="medium"
            >
              Don’t have an account? Register
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
