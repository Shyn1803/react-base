import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import axios from "../../api/axios";
import { login } from "../../slices/user/userSlice";
import { useNavigate } from "react-router-dom";
import MESSAGE from "../../utils/message";
import classnames from "classnames";

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
  const [isFadeOut, setFadeOut] = useState(false);

  const loginCardClassNames = classnames([
    "login-card",
    "fade-in",
    isFadeOut ? "fade-out" : "",
  ]);

  const { SYSTEM_ERROR } = MESSAGE;

  const onFinish = async (values: FormValueProps) => {
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
      if ([200, 201].includes(response?.status)) {
        dispatch(login(response?.data?.user || {}));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      messageApi.open({
        type: "error",
        content: SYSTEM_ERROR(),
      });
    }
  };

  const redirectToSignUp = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate("/signUp");
    }, 400);
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={loginCardClassNames}>
        <div className="login-text">Sign in</div>
        <Form
          name="login-form"
          className={styles.formCustom}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            className={styles.formItem}
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              { required: true, message: "Please input your email" },
            ]}
          >
            <Input autoComplete="off" placeholder="Email" />
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password autoComplete="off" placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
        <span className="sign-up-redirect-text-wrapper">
          Don’t have account?{" "}
          <span onClick={redirectToSignUp} className="sign-up-text">
            Sign up for free
          </span>
        </span>
        {contextHolder}
      </div>
    </div>
  );
}
