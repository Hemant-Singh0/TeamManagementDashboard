import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
  Grid,
  Box,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MDButton from "utils/MDButton";

const UserModal = ({
  open,
  onClose,
  user,
  onChange,
  onSubmit,
  isEditMode,
  loader,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleToggleConfirm = () => setShowConfirm((prev) => !prev);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 0 }}>
        {isEditMode ? "Edit Team Details" : "Add Team Details"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ mt: 2, mb: -2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name *"
                name="name"
                fullWidth
                variant="outlined"
                value={user.name || ""}
                onChange={onChange}
                autoFocus
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email *"
                name="email"
                type="email"
                fullWidth
                variant="outlined"
                value={user.email}
                onChange={onChange}
                autoComplete="email"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password *"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={user.password || ""}
                onChange={onChange}
                helperText="Minimum 6 characters, no spaces"
                placeholder="Enter a secure password"
                autoComplete="new-password"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password *"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={user.confirmPassword || ""}
                onChange={onChange}
                autoComplete="new-password"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleToggleConfirm} edge="end">
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                size="small"
                id="role-autocomplete"
                options={[
                  { label: "Manager", value: "manager" },
                  { label: "Member", value: "member" },
                ]}
                getOptionLabel={(option) => option.label}
                value={
                  user.role
                    ? {
                        label:
                          user.role.charAt(0).toUpperCase() +
                          user.role.slice(1),
                        value: user.role,
                      }
                    : null
                }
                onChange={(event, newValue) => {
                  onChange({
                    target: {
                      name: "role",
                      value: newValue ? newValue.value : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Role *"
                    variant="outlined"
                    fullWidth
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <MDButton
          onClick={onClose}
          size="small"
          color="error"
          variant="contained"
        >
          Cancel
        </MDButton>
        <MDButton
          onClick={onSubmit}
          size="small"
          color="success"
          variant="contained"
          disabled={loader}
        >
          {loader ? <CircularProgress size={20} color="inherit" /> : "Save"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

UserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  loading: PropTypes.bool,
};

export default UserModal;
