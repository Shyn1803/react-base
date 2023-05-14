import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserOutlined, HomeOutlined, ProfileOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "../../slices/user/userSlice";
import { Layout, Menu, Dropdown } from "antd";
import type { MenuProps } from "antd";

import styles from "./styles.module.scss";

const { Sider } = Layout;

const menuItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "Dashboard",
  },
  {
    key: "user",
    icon: <UserOutlined />,
    label: "User",
  },
  {
    key: "article",
    icon: <ProfileOutlined />,
    label: "Article",
  },
];

const userItems: MenuProps["items"] = [
  {
    key: "profile",
    label: <div>profile</div>,
  },
  {
    key: "logout",
    label: <div>logout</div>,
  },
];

const AdminLayout = (props: any) => {
  const userStore: any = useSelector((state: RootState) => state.user);
  const [selectedKey, setSelectedKey] = useState("home");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const onClick = (value: any) => {
    navigate(value?.key || "/");
    setSelectedKey(value?.key || "");
  };

  useEffect(() => {
    if (params["*"]) {
      setSelectedKey(params["*"]);
    }
  }, [params]);

  const handleButtonClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      dispatch(logout());
    } else {
      navigate(key || "/");
    }
  };

  return (
    <Layout className={styles.adminLayoutContainer}>
      <Sider trigger={null} width={250}>
        <Menu
          className="custom-menu"
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={onClick}
          selectedKeys={[selectedKey]}
        />
        <Dropdown
          menu={{ items: userItems, onClick: handleButtonClick }}
          placement="top"
          arrow={{ pointAtCenter: true }}
        >
          <div className="user-actions-wrapper">
            <div className="user-name">{userStore?.user?.username}</div>
            <div className="icon-wrapper">
              <UserOutlined style={{ color: "white" }} />
            </div>
          </div>
        </Dropdown>
      </Sider>
      <Layout className="content-layout-container">{props?.children}</Layout>
    </Layout>
  );
};

export default AdminLayout;
