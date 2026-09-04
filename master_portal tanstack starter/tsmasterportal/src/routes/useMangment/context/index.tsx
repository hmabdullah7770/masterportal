


import React, {
  createContext,
//   ReactNode,
  useContext,
  useState,
    useEffect,
} from "react";
import { getAllUsers } from "../../../server/usermanagement/userlist.server"; // adjust path

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
  apiCalls: () => Promise<void>;
  loadGridData: (shouldPageLoad?: boolean) => Promise<any>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
};

/* =======================
   Context
======================= */
const context = createContext<Context>({} as Context);

/* =======================
   Initial Values
======================= */
export const initialFilterData: FilterDataI = {
  pageSize: 20,
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
  const [data, setData] = useState<DataI>({
    gridData: [],
  });
  const [filterData, setFilterData] = useState<FilterDataI>(initialFilterData);
  const [searchValue, setSearchValue] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  /* =======================
     Load Grid Data
  ======================== */
  const loadGridData = async (shouldPageLoad = true): Promise<any> => {
    setLoading(shouldPageLoad);

    const searchParams = {
      page: filterData.pageNumber,
      limit: filterData.pageSize,
      search: filterData.search,
    };

    try {
      const response = await getAllUsers({ data: searchParams });

      setData((prevVal: any) => ({
        ...prevVal,
        gridData: response.users,
      }));

      setTotal(response.total);

      return response;
    } catch (error) {
      console.error("Error loading grid data:", error);

      setData((prevVal: any) => ({
        ...prevVal,
        gridData: [],
      }));

      setTotal(0);
      return error;
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Public API Calls
  ======================== */
  const apiCalls = async (): Promise<void> => {
    await loadGridData();
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
        apiCalls,
        loadGridData,
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