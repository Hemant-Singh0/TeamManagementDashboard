import React, { useEffect, useState } from "react";
import {
    Card, Grid, CircularProgress, Alert,
    IconButton, InputAdornment, Snackbar
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import MDBox from "utils/MDBox";
import MDTypography from "utils/MDTypography";
import MDInput from "utils/MDInput";
import MDButton from "utils/MDButton";
import URL from "../../config/configuration_keys.json";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const userID = localStorage.getItem("userID");
    const token = localStorage.getItem("token");
    const url = URL.REACT_APP_API_URL;
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        if (userID && token) fetchUser();
    }, [userID]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`${url}/users/${userID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch user data");
            const data = await res.json();

            setUserData(data);
            setForm({
                name: data.name || "",
                email: data.email || "",
                password: "",
                confirmPassword: ""
            });
        } catch (err) {
            setErrorMsg("Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        else if (form.name.trim().length < 3) newErrors.name = "At least 3 characters";

        if (form.password) {
            if (form.password.length < 6) newErrors.password = "Minimum 6 characters";
            if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMsg("");
        setErrorMsg("");

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updateData = {
            name: form.name.trim(),
            email: form.email.trim(),
            ...(form.password && { password: form.password }),
        };

        try {
            setSubmitLoading(true);
            const res = await fetch(`${url}/users/profile/${userID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Update failed");
            }

            setSuccessMsg("Profile updated successfully");
            setOpenSnackbar(true);
            fetchUser();
            setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        } catch (err) {
            setErrorMsg(err.message);
            setOpenSnackbar(true);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            {loading ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
                    <CircularProgress size={50} sx={{ color: "#1976d2" }} />
                </MDBox>
            ) : errorMsg && !userData ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <MDTypography variant="h6" color="error">{errorMsg}</MDTypography>
                </MDBox>
            ) : (
                <MDBox display="flex" justifyContent="center" sx={{ px: 2, py: 4 }}>
                    <Card
                        sx={{
                            maxWidth: 600,
                            width: "100%",
                            p: 4,
                            borderRadius: 3,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            <MDTypography variant="h4" fontWeight="bold" mb={3} textAlign="center" color="black">
                                My Profile
                            </MDTypography>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <MDInput
                                        fullWidth
                                        label="Name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <MDInput
                                        fullWidth
                                        label="Email Address"
                                        value={userData.email}
                                        disabled
                                        InputProps={{
                                            endAdornment: (
                                                <LockIcon sx={{ color: "grey.500", fontSize: 20, ml: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <MDInput
                                        fullWidth
                                        label="New Password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleChange}
                                        helperText={errors.password || "Leave blank to keep current password"}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <MDInput
                                        fullWidth
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        helperText={errors.confirmPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <MDButton
                                type="submit"
                                variant="gradient"
                                color="info"
                                fullWidth
                                sx={{ mt: 4, py: 1.8, fontSize: "1.1rem", fontWeight: "bold" }}
                                disabled={submitLoading}
                            >
                                {submitLoading ? <CircularProgress size={24} color="inherit" /> : "Update Profile"}
                            </MDButton>
                        </form>
                    </Card>
                </MDBox>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {errorMsg ? (
                    <Alert severity="error" onClose={() => setOpenSnackbar(false)}
                        sx={{ fontWeight: "bold", bgcolor: "#f44336", color: "#fff", borderRadius: 2, boxShadow: 3 }}>
                        {errorMsg}
                    </Alert>
                ) : successMsg ? (
                    <Alert severity="success" onClose={() => setOpenSnackbar(false)}
                        sx={{ fontWeight: "bold", bgcolor: "#2e7d32", color: "#fff", borderRadius: 2, boxShadow: 3 }}>
                        {successMsg}
                    </Alert>
                ) : null}
            </Snackbar>
        </DashboardLayout>
    );
};

export default Profile;
