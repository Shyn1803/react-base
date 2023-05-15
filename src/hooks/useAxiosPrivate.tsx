import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const useAxiosPrivate = () => {
  const userStore: any = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: any) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${userStore?.user?.token}`;
        }

        return config;
      },
      (error: any) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [userStore?.user]);

  return axiosPrivate;
};

export default useAxiosPrivate;
