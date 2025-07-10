import { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MDBox from "../../utils/MDBox";
import MDTypography from "../../utils/MDTypography";
import MDButton from "../../utils/MDButton";
import {
  useMaterialUIController,
  setOpenConfigurator,
} from "context";
import { Link } from "react-router-dom";

function Configurator() {
  const [controller, dispatch] = useMaterialUIController();
  const { openConfigurator } = controller;
  const [userName, setUserName] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const storedName = localStorage.getItem("user");
    if (storedName) setUserName(storedName);
  }, []);

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);

  return (
    <Drawer
      anchor="right"
      open={openConfigurator}
      onClose={handleCloseConfigurator}
      variant={isMobile ? "temporary" : "permanent"}
      sx={{
        width: isMobile ? "75vw" : 300,
        "& .MuiDrawer-paper": {
          width: isMobile ? "75vw" : 300,
          boxSizing: "border-box",
          padding: theme.spacing(2),
          backgroundColor: "#fff",
          boxShadow: theme.shadows[4],
          height: "auto",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "8px 0 0 8px",
        },
        display: openConfigurator ? "block" : "none",
      }}
    >
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <MDTypography variant="h5" fontWeight="bold" color="dark">
          Settings
        </MDTypography>
        <Icon
          onClick={handleCloseConfigurator}
          sx={({ typography: { size }, palette: { dark } }) => ({
            fontSize: `${size.lg} !important`,
            color: dark.main,
            stroke: "currentColor",
            strokeWidth: "2px",
            cursor: "pointer",
          })}
        >
          close
        </Icon>
      </MDBox>

      <Divider sx={{ mb: 2 }} />

      <MDBox
        px={1}
        py={2}
        borderRadius="xl"
        bgColor="grey-100"
        shadow="sm"
        mb={2}
      >
        <MDTypography
          variant="h6"
          fontWeight="medium"
          gutterBottom
          color="dark"
        >
          Hello, {userName || "Guest"}
        </MDTypography>

        <MDButton
          variant="outlined"
          color="info"
          size="small"
          component={Link}
          to="/profile"
          fullWidth
          onClick={handleCloseConfigurator}
        >
          Go to Profile Page
        </MDButton>
      </MDBox>
    </Drawer>
  );
}

export default Configurator;
