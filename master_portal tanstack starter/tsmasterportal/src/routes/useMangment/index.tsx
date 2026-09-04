// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/useMangment/')({
//   component: RouteComponent,
// })

// function RouteComponent() {

//   return <div>Hello /useMangment/!</div>
// }

import { createFileRoute } from "@tanstack/react-router";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import UserManagmentContextProvider, {
  useUserManagmentContext,
} from "./context";
import UserManagmentGrid from "./components/UserManagmentGrid";

export const Route = createFileRoute("/useMangment/")({
  component: () => (
    <UserManagmentContextProvider>
      <UserManagementPage />
    </UserManagmentContextProvider>
  ),
});

function UserManagementPage() {
  const { apiCalls } = useUserManagmentContext();

  useEffect(() => {
    apiCalls();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        User Management
      </Typography>
      <UserManagmentGrid />
    </Box>
  );
}