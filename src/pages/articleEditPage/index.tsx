import React, { useEffect } from "react";
import { message, Form, Select, Input, Button } from "antd";
import type { SelectProps } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useParams } from "react-router";

import styles from "./styles.module.scss";
import MESSAGE from "../../utils/message";
import TextArea from "antd/es/input/TextArea";

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
  tagList: Array<string>;
};

export default function ArticleEditPage() {
  const axiosPrivate = useAxiosPrivate();
  const { slug } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();

  const { SYSTEM_ERROR, UPDATE_SUCCESS } = MESSAGE;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    isMounted && getArticle(controller);

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getArticle = async (controller?: AbortController) => {
    try {
      const options: any = {};

      if (controller) {
        options.signal = controller?.signal;
      }

      await axiosPrivate.get(`${ARTICLES_URL}/${slug}`, options).then((res) => {
        if (res?.status === 200) {
          form.setFieldsValue(
            { ...res?.data?.article } || {}
          );
        }
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled", err.message);
      } else {
        console.log("Error: ", err);
        messageApi.open({
          type: "error",
          content: SYSTEM_ERROR(),
        });
      }
    }
  };

  const onFinish = async (values: FormValueProps) => {
    const { body, description, tagList, title } = values;
    try {
      await axiosPrivate
        .put(`${ARTICLES_URL}/${slug}`, {
          body,
          description,
          tagList,
          title,
        })
        .then((res) => {
          if ([200, 201].includes(res?.status)) {
            messageApi.open({
              type: "success",
              content: UPDATE_SUCCESS(),
            });

            getArticle();
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
    <div className={styles.articleEditPageContainer}>
      <h2 className="title">Edit Article</h2>
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

          <Form.Item className="form-item" label="Tags" name="tagList">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Tags Mode"
              options={tagOptions}
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
      {contextHolder}
    </div>
  );
}
