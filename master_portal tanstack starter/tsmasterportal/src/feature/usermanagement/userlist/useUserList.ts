// import { useState } from "react";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import { fetchUsers } from "../../../server/usermanagement/userlist.server";
// // useUserList.ts
// import type { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
// export const useUserList = () => {
//   const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
//     page: 0,
//     pageSize: 10,
//   });
//   const [sortModel, setSortModel] = useState<GridSortModel>([
//     { field: "createdAt", sort: "desc" },
//   ]);
//   const [search, setSearch] = useState("");

//   const query = useQuery({
//     queryKey: ["users", paginationModel, sortModel, search],
//     queryFn: () =>
//       fetchUsers({
//         data: {
//           page: paginationModel.page,
//           pageSize: paginationModel.pageSize,
//           search,
//           sortField: sortModel[0]?.field ?? "createdAt",
//           sortOrder: (sortModel[0]?.sort as "asc" | "desc") ?? "desc",
//         },
//       }),
//     placeholderData: keepPreviousData,
//   });

//   return {
//     rows: query.data?.rows ?? [],
//     total: query.data?.total ?? 0,
//     isLoading: query.isLoading,
//     paginationModel,
//     setPaginationModel,
//     sortModel,
//     setSortModel,
//     search,
//     setSearch,
//   };
// };