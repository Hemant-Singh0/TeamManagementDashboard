import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import MDButton from "utils/MDButton";

const TaskModal = ({
  open,
  onClose,
  taskData,
  onChange,
  onSubmit,
  isEditMode,
  loader,
  membersList,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 0 }}>
        {isEditMode ? "Edit Task" : "Add Task"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Task *"
              name="task"
              fullWidth
              variant="outlined"
              value={taskData.task || ""}
              onChange={onChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              size="small"
              options={membersList}
              getOptionLabel={(option) => option.name}
              value={
                taskData.assignTask
                  ? membersList.find((m) => m._id === taskData.assignTask) ||
                    null
                  : null
              }
              onChange={(e, newValue) => {
                onChange({
                  target: {
                    name: "assignTask",
                    value: newValue ? newValue._id : "",
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign to Member *"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
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

TaskModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  taskData: PropTypes.shape({
    task: PropTypes.string,
    assignTask: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  loader: PropTypes.bool,
  membersList: PropTypes.array.isRequired,
};

export default TaskModal;
