import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { getAllUsers } from "../../../server/usermanagement/userlist"; // adjust path

/* =======================
   Types
======================= */
export interface FilterDataI {
  pageSize: number;
  pageNumber: number;
  search: string;
}

export interface DataI {
  gridData: any[];
}

type Context = {
  data: DataI;
  setData: React.Dispatch<React.SetStateAction<DataI>>;
  filterData: FilterDataI;
  setFilterData: React.Dispatch<React.SetStateAction<FilterDataI>>;
  searchValue: any;
  setSearchValue: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loadGridData: (shouldPageLoad?: boolean) => Promise<any>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
  totalPages: number;
};

/* =======================
   Context
======================= */
const context = createContext<Context>({} as Context);

/* =======================
   Initial Values
======================= */
export const initialFilterData: FilterDataI = {
  pageSize: 10,
  pageNumber: 1,
  search: "",
};

/* =======================
   Provider
======================= */
export default function UserManagmentContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<DataI>({ gridData: [] });
  const [filterData, setFilterData] = useState<FilterDataI>(initialFilterData);
  const [searchValue, setSearchValue] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  /* =======================
     Race-condition guard
     Only the most recent call
     is allowed to write to state
  ======================== */
  const requestIdRef = useRef(0);

  /* =======================
     Load Grid Data
  ======================== */
  const loadGridData = async (shouldPageLoad = true): Promise<any> => {
    const requestId = ++requestIdRef.current;
    setLoading(shouldPageLoad);

    const searchParams = {
      page: filterData.pageNumber,
      limit: filterData.pageSize,
      search: filterData.search,
    };

    try {
      const response = await getAllUsers({ data: searchParams });

      // A newer call has started since this one began — discard this result
      if (requestId !== requestIdRef.current) {
        return response;
      }

      setData((prevVal: any) => ({
        ...prevVal,
        gridData: response.users,
      }));

      setTotal(response.total);

      return response;
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return error;
      }

      console.error("Error loading grid data:", error);

      setData((prevVal: any) => ({
        ...prevVal,
        gridData: [],
      }));

      setTotal(0);
      return error;
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  /* =======================
     Auto call API on mount and
     whenever page/search/pageSize change
  ======================== */
  useEffect(() => {
    loadGridData();
  }, [filterData.pageNumber, filterData.pageSize, filterData.search]);

  /* =======================
     Pagination helpers
  ======================== */
  const totalPages = Math.max(1, Math.ceil(total / filterData.pageSize));

  const goToNextPage = () => {
    setFilterData((prev) => {
      if (prev.pageNumber >= totalPages) return prev;
      return { ...prev, pageNumber: prev.pageNumber + 1 };
    });
  };

  const goToPrevPage = () => {
    setFilterData((prev) => {
      if (prev.pageNumber <= 1) return prev;
      return { ...prev, pageNumber: prev.pageNumber - 1 };
    });
  };

  const goToPage = (page: number) => {
    setFilterData((prev) => ({ ...prev, pageNumber: page }));
  };

  return (
    <context.Provider
      value={{
        data,
        setData,
        filterData,
        setFilterData,
        searchValue,
        setSearchValue,
        loading,
        setLoading,
        total,
        setTotal,
        loadGridData,
        goToNextPage,
        goToPrevPage,
        goToPage,
        totalPages,
      }}
    >
      {children}
    </context.Provider>
  );
}

/* =======================
   Hook
======================= */
export const useUserManagmentContext = () => useContext(context);
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
// } from "react";
// import { getAllUsers } from "../../../server/usermanagement/userlist.server"; // adjust path

// /* =======================
//    Types
// ======================= */
// export interface FilterDataI {
//   pageSize: number;
//   pageNumber: number;
//   search: string;
// }

// export interface DataI {
//   gridData: any[];
// }

// type Context = {
//   data: DataI;
//   setData: React.Dispatch<React.SetStateAction<DataI>>;
//   filterData: FilterDataI;
//   setFilterData: React.Dispatch<React.SetStateAction<FilterDataI>>;
//   searchValue: any;
//   setSearchValue: React.Dispatch<React.SetStateAction<any>>;
//   loading: boolean;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   loadGridData: (shouldPageLoad?: boolean) => Promise<any>;
//   total: number;
//   setTotal: React.Dispatch<React.SetStateAction<number>>;
//   goToNextPage: () => void;
//   goToPrevPage: () => void;
//   goToPage: (page: number) => void;
//   totalPages: number;
// };

// /* =======================
//    Context
// ======================= */
// const context = createContext<Context>({} as Context);

// /* =======================
//    Initial Values
// ======================= */
// export const initialFilterData: FilterDataI = {
//   pageSize: 10, // 10 entries per page as you asked
//   pageNumber: 1,
//   search: "",
// };

// /* =======================
//    Provider
// ======================= */
// export default function UserManagmentContextProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [data, setData] = useState<DataI>({ gridData: [] });
//   const [filterData, setFilterData] = useState<FilterDataI>(initialFilterData);
//   const [searchValue, setSearchValue] = useState<any>("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [total, setTotal] = useState<number>(0);

//   /* =======================
//      Load Grid Data
//   ======================== */
//   const loadGridData = async (shouldPageLoad = true): Promise<any> => {
//     setLoading(shouldPageLoad);

//     const searchParams = {
//       page: filterData.pageNumber,
//       limit: filterData.pageSize,
//       search: filterData.search,
//     };

//     try {
//       // this is the actual API call to the server function
//       const response = await getAllUsers({ data: searchParams });

//       setData((prevVal: any) => ({
//         ...prevVal,
//         gridData: response.users,
//       }));

//       setTotal(response.total);

//       return response;
//     } catch (error) {
//       console.error("Error loading grid data:", error);

//       setData((prevVal: any) => ({
//         ...prevVal,
//         gridData: [],
//       }));

//       setTotal(0);
//       return error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =======================
//      Auto call API whenever
//      page/search/pageSize change
//      (this covers first render too)
//   ======================== */
//   useEffect(() => {
//     loadGridData();
//   }, [filterData.pageNumber, filterData.pageSize, filterData.search]);

//   /* =======================
//      Pagination helpers
//   ======================== */
//   const totalPages = Math.max(1, Math.ceil(total / filterData.pageSize));

//   const goToNextPage = () => {
//     setFilterData((prev) => {
//       if (prev.pageNumber >= totalPages) return prev;
//       return { ...prev, pageNumber: prev.pageNumber + 1 };
//     });
//   };

//   const goToPrevPage = () => {
//     setFilterData((prev) => {
//       if (prev.pageNumber <= 1) return prev;
//       return { ...prev, pageNumber: prev.pageNumber - 1 };
//     });
//   };

//   const goToPage = (page: number) => {
//     setFilterData((prev) => ({ ...prev, pageNumber: page }));
//   };

//   return (
//     <context.Provider
//       value={{
//         data,
//         setData,
//         filterData,
//         setFilterData,
//         searchValue,
//         setSearchValue,
//         loading,
//         setLoading,
//         total,
//         setTotal,
//         loadGridData,
//         goToNextPage,
//         goToPrevPage,
//         goToPage,
//         totalPages,
//       }}
//     >
//       {children}
//     </context.Provider>
//   );
// }

// /* =======================
//    Hook
// ======================= */
// export const useUserManagmentContext = () => useContext(context);
// // import React, {
// //   createContext,
// // //   ReactNode,
// //   useContext,
// //   useState,
// //     useEffect,
// // } from "react";
// // import { getAllUsers } from "../../../server/usermanagement/userlist.server"; // adjust path

// // /* =======================
// //    Types
// // ======================= */
// // export interface FilterDataI {
// //   pageSize: number;
// //   pageNumber: number;
// //   search: string;
// // }

// // export interface DataI {
// //   gridData: any[];
// // }

// // type Context = {
// //   data: DataI;
// //   setData: React.Dispatch<React.SetStateAction<DataI>>;
// //   filterData: FilterDataI;
// //   setFilterData: React.Dispatch<React.SetStateAction<FilterDataI>>;
// //   searchValue: any;
// //   setSearchValue: React.Dispatch<React.SetStateAction<any>>;
// //   loading: boolean;
// //   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
// //   apiCalls: () => Promise<void>;
// //   loadGridData: (shouldPageLoad?: boolean) => Promise<any>;
// //   total: number;
// //   setTotal: React.Dispatch<React.SetStateAction<number>>;
// // };

// // /* =======================
// //    Context
// // ======================= */
// // const context = createContext<Context>({} as Context);

// // /* =======================
// //    Initial Values
// // ======================= */
// // export const initialFilterData: FilterDataI = {
// //   pageSize: 20,
// //   pageNumber: 1,
// //   search: "",
// // };

// // /* =======================
// //    Provider
// // ======================= */
// // export default function UserManagmentContextProvider({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const [data, setData] = useState<DataI>({
// //     gridData: [],
// //   });
// //   const [filterData, setFilterData] = useState<FilterDataI>(initialFilterData);
// //   const [searchValue, setSearchValue] = useState<any>("");
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [total, setTotal] = useState<number>(0);

// //   /* =======================
// //      Load Grid Data
// //   ======================== */
// //   const loadGridData = async (shouldPageLoad = true): Promise<any> => {
// //     setLoading(shouldPageLoad);

// //     const searchParams = {
// //       page: filterData.pageNumber,
// //       limit: filterData.pageSize,
// //       search: filterData.search,
// //     };

// //     try {
// //       const response = await getAllUsers({ data: searchParams });

// //       setData((prevVal: any) => ({
// //         ...prevVal,
// //         gridData: response.users,
// //       }));

// //       setTotal(response.total);

// //       return response;
// //     } catch (error) {
// //       console.error("Error loading grid data:", error);

// //       setData((prevVal: any) => ({
// //         ...prevVal,
// //         gridData: [],
// //       }));

// //       setTotal(0);
// //       return error;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* =======================
// //      Public API Calls
// //   ======================== */
// //   const apiCalls = async (): Promise<void> => {
// //     await loadGridData();
// //   };

// //   return (
// //     <context.Provider
// //       value={{
// //         data,
// //         setData,
// //         filterData,
// //         setFilterData,
// //         searchValue,
// //         setSearchValue,
// //         loading,
// //         setLoading,
// //         total,
// //         setTotal,
// //         apiCalls,
// //         loadGridData,
// //       }}
// //     >
// //       {children}
// //     </context.Provider>
// //   );
// // }

// // /* =======================
// //    Hook
// // ======================= */
// // export const useUserManagmentContext = () => useContext(context);