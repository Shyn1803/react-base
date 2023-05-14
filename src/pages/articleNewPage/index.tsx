import React from "react";
import { message, Form, Select, Input, Button } from "antd";
import type { SelectProps } from "antd";
import { useForm } from "antd/es/form/Form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

import MESSAGE from "../../utils/message";
import styles from "./styles.module.scss";

const ARTICLES_URL = "api/articles";

const tagOptions: SelectProps["options"] = [
  {
    value: "Living",
    label: "Living",
  },
  {
    value: "Working",
    label: "Working",
  },
];

type FormValueProps = {
  title: string;
  description: string;
  body: string;
  tags: any;
};

export default function ArticleNewPage() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();

  const {
    SYSTEM_ERROR,
    UPDATE_SUCCESS,
  } = MESSAGE;

  const onFinish = async (values: FormValueProps) => {
    try {
      await axiosPrivate.post(ARTICLES_URL, values).then((res) => {
        if ([200, 201].includes(res?.status)) {
          messageApi.open({
            type: "success",
            content: UPDATE_SUCCESS(),
          });

          navigate("/article");
        }
      });
    } catch (err) {
      messageApi.open({
        type: "error",
        content: SYSTEM_ERROR(),
      });
    }
  };

  return (
    <div className={styles.articleNewPageContainer}>
      <h2 className="title">New Article</h2>
      <div className="form-wrapper">
        <Form
          name="article-form"
          className="article-form"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item className="form-item" label="Title" name="title">
            <Input />
          </Form.Item>

          <Form.Item
            className="form-item"
            label="Description"
            name="description"
          >
            <Input />
          </Form.Item>

          <Form.Item className="form-item" label="Body" name="body">
            <TextArea />
          </Form.Item>

          <Form.Item className="form-item" label="Tags" name="tags">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Tags Mode"
              options={tagOptions}
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button type="primary" htmlType="submit">
              Add new article
            </Button>
          </Form.Item>
        </Form>
      </div>
      {contextHolder}
    </div>
  );
}
