import { Box, Typography } from "@mui/material";
import DashboardLayout from "../../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../components/Navbars/DashboardNavbar";
import MDBox from "../../utils/MDBox";

function Dashboard() {
  const userName = localStorage.getItem("user");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          pt: { xs: 8, md: 10 },
        }}
      >
        <Box
          sx={{
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            borderRadius: "20px",
            padding: { xs: 4, md: 6 },
            width: { xs: "90%", sm: "70%", md: "45%" },
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: "#ffe082",
              fontSize: { xs: "2.4rem", md: "3rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Welcome to Dashboard
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: "#ffffff",
              mb: 3,
              fontWeight: 300,
              fontSize: "1.5rem",
            }}
          >
            Hello, <strong>{userName || ""}</strong>
          </Typography>
        </Box>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
