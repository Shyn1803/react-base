import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import MESSAGE from "../../utils/message";
import classnames from "classnames";

import styles from "./styles.module.scss";

type FormValueProps = {
  username: string;
  email: string;
  password: string;
};

const REGISTER_URL = "api/users";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isFadeOut, setFadeOut] = useState(false);

  const signUpCardClassNames = classnames([
    "sign-up-card",
    "fade-in",
    isFadeOut ? "fade-out" : "",
  ]);

  const { SYSTEM_ERROR, REGISTER_USER_SUCCESS } = MESSAGE;

  const onFinish = async (values: FormValueProps) => {
    const { username, email, password } = values;

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ username, email, password }),
        {
          headers: { "content-type": "application/json" },
        }
      );
      if ([200, 201].includes(response?.status)) {
        messageApi.open({
          type: "success",
          content: REGISTER_USER_SUCCESS(),
        });
        setFadeOut(true);
        setTimeout(() => {
          navigate("/login");
        }, 400);
      }
    } catch (err) {
      console.log(err);
      messageApi.open({
        type: "error",
        content: SYSTEM_ERROR(),
      });
    }
  };

  const redirectToSignIn = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate("/login");
    }, 400);
  };

  return (
    <div className={styles.signUpPageContainer}>
      <div className={signUpCardClassNames}>
        <div className="sign-up-text">Sign up</div>
        <Form
          name="sign-up-form"
          className={styles.formCustom}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            className={styles.formItem}
            name="username"
            rules={[{ required: true, message: "Please input your username" }]}
          >
            <Input autoComplete="off" placeholder="Username" />
          </Form.Item>

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
              Sign up
            </Button>
          </Form.Item>
        </Form>
        <span className="sign-up-redirect-text-wrapper">
          Already have an account?{" "}
          <span onClick={redirectToSignIn} className="sign-in-text">
            Sign in
          </span>
        </span>
        {contextHolder}
      </div>
    </div>
  );
}
