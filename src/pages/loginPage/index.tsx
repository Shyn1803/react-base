import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import axios from "../../api/axios";
import { login } from "../../slices/user/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
// import { MESSAGE } from '../../../utils/messages';

import styles from "./styles.module.scss";

type FormValueProps = {
  email: string;
  password: string;
};

const LOGIN_URL = "api/login";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // const { SYSTEM_ERROR } = MESSAGE;

  const onFinish = async (values: FormValueProps) => {
    console.log("onFinish: ", values);
    const { email, password } = values;

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "content-type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      if ([200, 201].includes(response?.status)) {
        dispatch(login(response?.data?.user || {}));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.fromWrapper}>
      <Form
        name="login-form"
        className={styles.formCustom}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          className={styles.formItem}
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className={styles.formItem}
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
      {contextHolder}
    </div>
  );
}
