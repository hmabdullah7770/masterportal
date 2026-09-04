import { Avatar, TableCell, TableRow } from "@mui/material";
import React from "react";

interface RowProps {
  RowData: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    bio?: string;
    age?: number;
    gender?: string;
    avatar?: string;
    createdAt?: string;
  };
}

const Row = ({ RowData }: RowProps) => {
  const formattedDate = RowData?.createdAt
    ? new Date(RowData.createdAt).toLocaleDateString()
    : "-";

  return (
    <TableRow hover sx={{ "& > *": { borderBottom: "unset" } }}>
      <TableCell>
        <Avatar src={RowData?.avatar} alt={RowData?.username}>
          {RowData?.username?.charAt(0)?.toUpperCase()}
        </Avatar>
      </TableCell>
      <TableCell>{RowData?.username || "-"}</TableCell>
      <TableCell>{RowData?.fullName || "-"}</TableCell>
      <TableCell>{RowData?.email || "-"}</TableCell>
      <TableCell>{RowData?.gender || "-"}</TableCell>
      <TableCell>{RowData?.age ?? "-"}</TableCell>
      <TableCell>{RowData?.bio || "-"}</TableCell>
      <TableCell>{formattedDate}</TableCell>
    </TableRow>
  );
};

export default React.memo(Row);


// import React from 'react'
// import { useEffect, useState } from "react";

// const Row = () => {
//   return (
//     <div>Row</div>
//   )
// }

// export default Row