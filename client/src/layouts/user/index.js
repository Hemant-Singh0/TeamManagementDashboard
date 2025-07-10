import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../utils/MDBox";
import MDTypography from "../../utils/MDTypography";
import DashboardLayout from "../../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../components/Navbars/DashboardNavbar";
import DataTable from "../../components/Tables/DataTable";
import UserModal from "./modals";
import MDButton from "utils/MDButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./modals/deleteModel";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  clearMessages,
} from "../../redux/user/userSlice";

function Tables() {
  const dispatch = useDispatch();
  const { users, loading, error, success } = useSelector(
    (state) => state.users
  );
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userDataToDelete, setUserDataToDelete] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      handleClose();
    }
  }, [success]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => {
    setOpen(true);
    setIsEditMode(false);
    setUserData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
  };

  const handleEdit = (item) => {
    setUserData({
      name: item.name || "",
      email: item.email,
      password: "",
      confirmPassword: "",
      role: item.role || "",
    });
    setEditingId(item._id);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setUserData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
  };

  const handleDelete = () => {
    if (userDataToDelete) {
      dispatch(deleteUser(userDataToDelete._id));
      setDeleteModalOpen(false);
    }
  };

  const openDeleteModal = (item) => {
    setUserDataToDelete(item);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserDataToDelete(null);
  };

  const validateUserData = (data, isEditMode) => {
    const errors = [];

    if (!data.name.trim()) errors.push("Name is required");
    if (!data.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Invalid email format");
    }
    if (!data.role.trim()) errors.push("Role is required");

    const shouldValidatePassword = !isEditMode || data.password;

    if (shouldValidatePassword) {
      if (!data.password) {
        errors.push("Password is required");
      } else {
        if (data.password.length < 6) errors.push("Password must be at least 6 characters");
        if (/\s/.test(data.password)) errors.push("Password must not contain spaces");
      }

      if (!data.confirmPassword) {
        errors.push("Confirm Password is required");
      } else if (data.password !== data.confirmPassword) {
        errors.push("Passwords do not match");
      }
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateUserData(userData, isEditMode);

    if (errors.length > 0) {
      dispatch(clearMessages());
      alert(errors.join(", "));
      return;
    }

    if (isEditMode) {
      dispatch(updateUser({ id: editingId, userData }));
    } else {
      dispatch(createUser(userData));
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(clearMessages());
  };

  const loggedInUserRole = localStorage.getItem("userRole");
  const columns = [
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "Role", accessor: "role", align: "center" },
    ...(loggedInUserRole === "owner"
      ? [{ Header: "Action", accessor: "action", align: "center" }]
      : []),
  ];

  const filteredUsers = users?.filter((user) => {
    if (loggedInUserRole === "owner") return true;
    if (loggedInUserRole === "manager") return user.role === "member";
    return false;
  });

  const rows = filteredUsers?.map((item) => ({
    name: (
      <MDTypography variant="button" fontWeight="medium">
        {item.name}
      </MDTypography>
    ),
    email: (
      <MDTypography variant="button" fontWeight="medium">
        {item.email}
      </MDTypography>
    ),
    role: (
      <MDTypography variant="button" fontWeight="medium">
        {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
      </MDTypography>
    ),
    ...(loggedInUserRole === "owner"
      ? {
        action: (
          <MDBox display="flex" gap={1} justifyContent="center">
            <IconButton
              color="info"
              onClick={() => handleEdit(item)}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => openDeleteModal(item)}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </MDBox>
        ),
      }
      : {}),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-2}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="h6" color="white">
                    Teams List
                  </MDTypography>
                  {loggedInUserRole === "owner" && (
                    <MDButton
                      color="dark"
                      variant="gradient"
                      size="small"
                      onClick={handleOpen}
                    >
                      Add Team
                    </MDButton>
                  )}
                </MDBox>
              </MDBox>
              <MDBox pt={3} px={2} pb={2}>
                {loading ? (
                  <MDTypography
                    textAlign="center"
                    py={4}
                    variant="h6"
                    color="text"
                  >
                    Loading team data... Please wait.
                  </MDTypography>
                ) : filteredUsers.length === 0 ? (
                  <MDTypography
                    textAlign="center"
                    py={4}
                    variant="h6"
                    color="text"
                  >
                    No team records found.
                  </MDTypography>
                ) : (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {loggedInUserRole === "owner" && (
        <>
          <DeleteModal
            open={deleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleDelete}
            name={userDataToDelete ? userDataToDelete.name : ""}
          />
          <UserModal
            open={open}
            onClose={handleClose}
            user={userData}
            onChange={handleUserChange}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
            loader={loading}
          />
        </>
      )}

      <Snackbar
        open={!!error || !!success}
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
    </DashboardLayout>
  );
}

export default Tables;
