// import React from 'react'

// const UserManagmentGrid = () => {
//   return (
//     <div>UserManagmentGrid</div>
//   )
// }

// export default UserManagmentGrid

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useUserManagmentContext } from "../context";
// import { Loader } from "Shared/Common/Loader";
// import NoRecord from "../../../Shared/Common/NoRecord";
import Row from "./Row";

const columns = [
  { key: "avatar", label: "Avatar" },
  { key: "username", label: "Username" },
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "gender", label: "Gender" },
  { key: "age", label: "Age" },
  { key: "bio", label: "Bio" },
  { key: "createdAt", label: "Created At" },
];

const UserManagmentGrid = () => {
  const {
    data,
    loading,
    filterData,
    setFilterData,
    searchValue,
    setSearchValue,
    loadGridData,
  } = useUserManagmentContext();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    loadGridData(true);
  }, [filterData.pageNumber, filterData.pageSize]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setFilterData((prev) => ({
        ...prev,
        search: searchValue,
        pageNumber: 1,
      }));
      loadGridData(true);
    }
  };

  return (
    <div>
      <Box sx={{ height: "auto", width: "100%" }}>
        <div className="table_bordered overflow-hidden">
          <TableContainer
            component={Paper}
            className="shadow-none"
            sx={{
              maxHeight: "calc(100vh - 220px)",
              "&::-webkit-scrollbar": { width: 7 },
              "&::-webkit-scrollbar-track": { backgroundColor: "#fff" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "var(--kt-gray-400)",
                borderRadius: 2,
              },
            }}
          >
            <Table
              stickyHeader
              aria-label="user management table"
              className="table table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              <TableHead>
                {/* Search row */}
                <TableRow className="h-40px">
                  <TableCell></TableCell>
                  {columns.slice(1).map((col) => (
                    <TableCell key={col.key}>
                      {col.key === "username" ? (
                        <TextField
                          size="small"
                          placeholder="Search username, email, name..."
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                        />
                      ) : null}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Header labels row */}
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      {/* <Loader /> */}
                    </TableCell>
                  </TableRow>
                ) : data.gridData?.length ? (
                  data.gridData.map((RowData: any) => (
                    <Row key={RowData._id} RowData={RowData} />
                  ))
                ) : (
                  <p>...</p>
                  // <NoRecord />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </div>
  );
};

export default React.memo(UserManagmentGrid);