import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "utils/MDButton";
import PropTypes from "prop-types";

function DeleteLocationModal({ open, onClose, onConfirm, name }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this {name}?</p>
      </DialogContent>
      <DialogActions>
        <MDButton color="secondary" onClick={onClose}>
          Cancel
        </MDButton>
        <MDButton color="error" onClick={onConfirm}>
          Delete
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

DeleteLocationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  name: PropTypes.func.isRequired,
};

export default DeleteLocationModal;
