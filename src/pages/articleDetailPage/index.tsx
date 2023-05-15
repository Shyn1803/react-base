import React, { useEffect, useState } from "react";
import { message, Avatar, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { AVATAR_DEFAULT_URL } from "../../utils/constant";

import MESSAGE from "../../utils/message";

import styles from "./styles.module.scss";

const ARTICLES_URL = "api/articles";

export default function ArticleDetailPage() {
  const axiosPrivate = useAxiosPrivate();
  const { slug } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [article, setArticle] = useState<any>({});
  const [newCommentBody, setNewCommentBody] = useState<string>("");

  const {
    SYSTEM_ERROR,
    DELETE_SUCCESS,
    DELETE_FAILED,
    COMMENT_CREATE_SUCCESS,
    CREATE_FAILED,
  } = MESSAGE;

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

      await axiosPrivate.get(`${ARTICLES_URL}/${slug}`, options).then((res: any) => {
        if (res?.status === 200) {
          setArticle(res?.data?.article || {});
        }
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

  const formatDate = (date: Date) => {
    return dayjs(date).format("MMM DD, YYYY");
  };

  const deleteComment = async (id: number) => {
    try {
      await axiosPrivate
        .delete(`${ARTICLES_URL}/${slug}/comments/${id}`)
        .then((res: any) => {
          if (res?.status === 200) {
            messageApi.open({
              type: "success",
              content: DELETE_SUCCESS(),
            });

            getArticle();
          }
        });
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: DELETE_FAILED(),
      });
    }
  };

  const addNewComment = async () => {
    try {
      const response = await axiosPrivate.post(
        `${ARTICLES_URL}/${slug}/comments`,
        JSON.stringify({ body: newCommentBody }),
        {
          headers: { "content-type": "application/json" },
          withCredentials: true,
        }
      );

      if ([200, 201].includes(response?.status)) {
        messageApi.open({
          type: "success",
          content: COMMENT_CREATE_SUCCESS(),
        });

        setNewCommentBody("");
        const controller = new AbortController();
        getArticle(controller);
      }
    } catch (err) {
      messageApi.open({
        type: "success",
        content: CREATE_FAILED(),
      });
    }
  };

  return (
    <div className={styles.articleDetailPageContainer}>
      <h2 className="title">{article?.title}</h2>
      <div className="info">
        <div className="date-time">
          Publish: {article?.updated && formatDate(new Date(article?.updated))}
        </div>
        <div className="separate"></div>
        <div className="tags">
          {article?.tagList?.map((tag: string) => {
            return <div className="tag-wrapper">{tag}</div>;
          })}
        </div>
      </div>
      <div className="body">{article?.body}</div>
      <div className="separate"></div>
      <div className="comments-wrapper">
        <div className="comment-title">Comments</div>
        <List
          itemLayout="horizontal"
          dataSource={article?.comments}
          renderItem={(item: any, index) => (
            <List.Item
              actions={[
                <div
                  onClick={() => deleteComment(item?.id)}
                  className="edit-comment-btn"
                  key="list-loadmore-edit"
                >
                  <DeleteOutlined style={{ color: "red" }} />
                </div>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar src={item?.author?.image || AVATAR_DEFAULT_URL} />
                }
                title={
                  <a href="https://ant.design">{item?.author?.username}</a>
                }
                description={item?.body}
              />
            </List.Item>
          )}
        />
        <textarea
          rows={4}
          value={newCommentBody}
          onChange={(e) => setNewCommentBody(e?.target?.value)}
          className="text-area-add-comment"
        />
        <div className="btn-add-comment-wrapper">
          <button
            onClick={addNewComment}
            className="btn-add-comment primary"
            disabled={!newCommentBody}
          >
            add comment
          </button>
        </div>
      </div>
      {contextHolder}
    </div>
  );
}
