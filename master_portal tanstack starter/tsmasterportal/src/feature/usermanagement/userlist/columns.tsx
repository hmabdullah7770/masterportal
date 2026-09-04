// columns.tsx
import type { GridColDef } from "@mui/x-data-grid";
export const userColumns: GridColDef[] = [
  { field: "username", headerName: "Username", flex: 1, minWidth: 150 },
  { field: "fullName", headerName: "Full Name", flex: 1, minWidth: 150 },
  { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
  { field: "age", headerName: "Age", width: 80 },
  { field: "gender", headerName: "Gender", width: 100 },
  { field: "whatsapp", headerName: "WhatsApp", width: 130 },
  { field: "instagram", headerName: "Instagram", flex: 1, minWidth: 150 },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 180,
    valueFormatter: (value) => new Date(value).toLocaleString(),
  },
];