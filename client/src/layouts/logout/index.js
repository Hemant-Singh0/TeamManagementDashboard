import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MDBox from "utils/MDBox";
import MDTypography from "utils/MDTypography";
import MDButton from "utils/MDButton";
import LogoutIcon from "@mui/icons-material/Logout";

const Logout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleConfirmLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCancel = () => {
    setOpen(false);
    navigate(-1);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      keepMounted
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <MDBox display="flex" alignItems="center" gap={1}>
          <LogoutIcon color="error" />
          <MDTypography variant="h6" fontWeight="bold">
            Confirm Logout
          </MDTypography>
        </MDBox>
      </DialogTitle>

      <DialogContent>
        <MDTypography variant="body2" color="text">
          Are you sure you want to log out of your account? This action will end your session.
        </MDTypography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <MDButton
          onClick={handleCancel}
          variant="outlined"
          color="dark"
          sx={{ borderRadius: 2, textTransform: "capitalize" }}
        >
          Cancel
        </MDButton>

        <MDButton
          onClick={handleConfirmLogout}
          variant="gradient"
          color="error"
          sx={{ borderRadius: 2, textTransform: "capitalize", px: 3 }}
        >
          Logout
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default Logout;
