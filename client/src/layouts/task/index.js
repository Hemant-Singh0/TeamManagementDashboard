import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../utils/MDBox";
import MDTypography from "../../utils/MDTypography";
import DashboardLayout from "../../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../components/Navbars/DashboardNavbar";
import DataTable from "../../components/Tables/DataTable";
import TaskModal from "./modals";
import MDButton from "utils/MDButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./modals/deleteModel";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  clearTaskMessages,
} from "../../redux/task/taskSlice.js";
import { fetchUsers } from "../../redux/user/userSlice";

function Tables() {
  const dispatch = useDispatch();
  const { tasks, loading, error, success } = useSelector(
    (state) => state.tasks
  );
  const { users } = useSelector((state) => state.users);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [data, setData] = useState({
    task: "",
    assignTask: "",
    status: "",
  });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      handleClose();
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => {
    setOpen(true);
    setIsEditMode(false);
    setData({
      task: "",
      assignTask: "",
    });
  };

  const handleEdit = (item) => {
    setData({
      task: item.task || "",
      assignTask: item.assignTask?._id,
      status: "",
    });
    setEditingId(item._id);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setData({
      task: "",
      assignTask: "",
    });
  };

  const handleDelete = () => {
    if (dataToDelete) {
      dispatch(deleteTask(dataToDelete._id));
      setDeleteModalOpen(false);
    }
  };

  const openDeleteModal = (item) => {
    setDataToDelete(item);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDataToDelete(null);
  };

  const handleSubmit = () => {
    const errors = [];
    if (!data.task.trim()) errors.push("Task is required");
    if (!data.assignTask) errors.push("Assign to member is required");

    if (errors.length > 0) {
      dispatch(clearTaskMessages());
      alert(errors.join(", "));
      return;
    }

    if (isEditMode) {
      dispatch(updateTask({ id: editingId, taskData: data }));
    } else {
      dispatch(createTask(data));
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(clearTaskMessages());
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateTask({ id, taskData: { status: newStatus } }));
  };

  const formatStatus = (status) => {
    if (!status) return "No status available";
    return status
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  const loggedInUserId = localStorage.getItem("userID");
  const loggedInUserRole = localStorage.getItem("userRole");
  const columns = [
    { Header: "Task", accessor: "task", align: "left" },
    { Header: "Assign Task", accessor: "assignTask", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    ...(loggedInUserRole === "manager"
      ? [{ Header: "Action", accessor: "action", align: "center" }]
      : []),
  ];

  const filteredTasks =
    loggedInUserRole === "member"
      ? tasks.filter((task) => task.assignTask?._id === loggedInUserId)
      : tasks;

  const rows = filteredTasks?.map((item) => {
    const commonFields = {
      task: (
        <MDTypography variant="button" fontWeight="medium">
          {item.task}
        </MDTypography>
      ),
      assignTask: (
        <MDTypography variant="button" fontWeight="medium">
          {item.assignTask?.name}
        </MDTypography>
      ),
    };

    if (loggedInUserRole === "manager") {
      return {
        ...commonFields,
        status: (
          <MDTypography
            variant="button"
            fontWeight="medium"
            color={item.status ? "text" : "error"}
          >
            {formatStatus(item.status)}
          </MDTypography>
        ),
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
      };
    } else {
      return {
        ...commonFields,
        status: (
          <select
            value={item.status}
            onChange={(e) => handleStatusChange(item._id, e.target.value)}
            style={{
              padding: "4px 8px",
              background: "#fff",
              fontSize: "0.9rem",
              border: "none",
              outline: "none",
              borderRadius: "none",
            }}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        ),
      };
    }
  });

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
                    Task List
                  </MDTypography>
                  {loggedInUserRole === "manager" && (
                    <MDButton
                      color="dark"
                      variant="gradient"
                      size="small"
                      onClick={handleOpen}
                    >
                      Add Task
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
                    Loading task data... Please wait.
                  </MDTypography>
                ) : tasks.length === 0 ? (
                  <MDTypography
                    textAlign="center"
                    py={4}
                    variant="h6"
                    color="text"
                  >
                    No task records found.
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

      {loggedInUserRole === "manager" && (
        <>
          <DeleteModal
            open={deleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleDelete}
            name={dataToDelete ? dataToDelete.name : ""}
          />

          <TaskModal
            open={open}
            onClose={handleClose}
            taskData={data}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
            loader={loading}
            membersList={users.filter((u) => u.role === "member")}
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
