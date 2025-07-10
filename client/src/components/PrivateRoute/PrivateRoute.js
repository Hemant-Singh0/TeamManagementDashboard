import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "utils/MDBox";

const PrivateRoute = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(auth);
      setCheckingAuth(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  if (checkingAuth) {
    return (
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          px: 2,
          pt: "200px",
        }}
      >
        <CircularProgress size={50} sx={{ color: "#1976d2" }} />
      </MDBox>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;

