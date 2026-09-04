import { DataGrid } from "@mui/x-data-grid";
import { TextField, Box } from "@mui/material";
import { userColumns } from "./columns";
import { useUserList } from "./useUserList";

export const UserList = () => {
  const {
    rows,
    total,
    isLoading,
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    search,
    setSearch,
  } = useUserList();

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        label="Search users"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      <DataGrid
        rows={rows}
        columns={userColumns}
        rowCount={total}
        loading={isLoading}
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        pageSizeOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};