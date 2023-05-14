import React, { useEffect } from "react";
import { Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUsers,
  showLoading,
  hideLoading,
} from "../../slices/users/usersSlice";
import type { ColumnsType } from "antd/es/table";
import TableDragComponent from "../../components/tableDragComponent";
import ErrorBoundary from "../../components/errorBoundary";

import MESSAGE from "../../utils/message";

import styles from "./styles.module.scss";

const USER_URL = "api/users";

interface DataType {
  id: number;
  username: string;
  email: string;
  bio: string;
  image: string;
}

export default function UserPage() {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const usersStore: any = useSelector((state: RootState) => state.users);

  const { SYSTEM_ERROR, DELETE_SUCCESS, DELETE_FAILED } = MESSAGE;

  const columns: ColumnsType<DataType> = [
    {
      key: "sort",
      width: "50px",
    },
    {
      title: "User",
      render: (_, record) => {
        return (
          <div className="user-wrapper">
            <div className="image-wrapper">
              {record?.image && <img src={record?.image} alt="user-avatar" />}
            </div>
            <div className="username-wrapper">
              <span>{record?.username || ""}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Bio",
      dataIndex: "bio",
    },
    {
      title: "operation",
      width: "60px",
      render: (_, record) => (
        <div className="operation-wrapper">
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record?.email)}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    isMounted && getUsers(controller);

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUsers = async (controller?: AbortController) => {
    try {
      const options: any = {};

      if (controller) {
        options.signal = controller?.signal;
      }

      dispatch(showLoading());
      await axiosPrivate
        .get(USER_URL, options)
        .then((res) => {
          if (res?.data) {
            const formatData = res?.data?.map((item: any) => {
              item.key = `${item?.id}`;
              return item;
            });

            dispatch(saveUsers(formatData));
          }
        })
        .finally(() => {
          dispatch(hideLoading());
        });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled", err.message);
      } else {
        messageApi.open({
          type: "error",
          content: SYSTEM_ERROR(),
        });
      }
    }
  };

  const handleDelete = async (email?: string) => {
    if (email) {
      try {
        await axiosPrivate.delete(`${USER_URL}/${email}`).then((res: any) => {
          if (res?.status === 200) {
            messageApi.open({
              type: "success",
              content: DELETE_SUCCESS(),
            });
          }

          const controller = new AbortController();
          getUsers(controller);
        });
      } catch (err: any) {
        messageApi.open({
          type: "error",
          content:
            err?.response?.status === 400
              ? err?.response?.data?.message
              : DELETE_FAILED(),
        });
      }
    }
  };

  return (
    <div className={styles.userPageContainer}>
      <h2>User List</h2>
      <ErrorBoundary>
        <TableDragComponent
          data={usersStore?.data || []}
          columns={columns}
          isLoading={usersStore?.loadingStatus}
        />
      </ErrorBoundary>
      {contextHolder}
    </div>
  );
}
