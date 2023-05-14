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

      await axiosPrivate.get(`${ARTICLES_URL}/${slug}`, options).then((res) => {
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

// const COMMENTS = [
//   {
//     id: 1,
//     created: 1684053730840,
//     body: "First comment",
//     author: {
//       id: 13,
//       username: "shyntest",
//       email: "shyntest@gmail.com",
//       bio: "HIHI",
//       image: "",
//     },
//   },
//   {
//     id: 2,
//     created: 1684053751446,
//     body: "Second comment",
//     author: {
//       id: 13,
//       username: "shyntest",
//       email: "shyntest@gmail.com",
//       bio: "HIHI",
//       image: "",
//     },
//   },
// ];

// const ARTICLE = {
//   id: 5,
//   slug: "1212 - wjub9k",
//   title: "1212",
//   description: "12121",
//   body: "<p>12121</p>",
//   created: 1622711912691,
//   updated: 1622711912691,
//   tagList: ["tag1", "tag2"],
//   favoriteCount: 0,
//   author: {
//     id: 3,
//     username: "jack2@wthapps.com",
//     email: "jack2@wthapps.com",
//     bio: "test",
//     image:
//       "data:image/png;base64,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0eqVfEpWW//tsHd9k5M+yXNrg3RQf9P63smfdHJPhTn7S1Zt/Yvy1Selib9R/89ht52/Pk56q3yZtup7tiVHOsmhr/+zY1Qx/idlXP5JnvXF5avdUm/7H9Z19k1l3BhFMvy+tXx6GWw/9zkp48f4wQAMwAAMwAAMwAAMwMBzMxA+UcGgPvegMn7XGz85Urwjytu3l+/LvuN2DmRNgRWzgRyv3qYtZ5a326M6omoc1Pb7PrFdn6/Pws9Sfp99rNfOv3exz7OP77Prv5bPZ+83+tePIdgG28AADMAADMAADMAADMDAczFAoOK75xowJtjXjlfP0dzLf/fxynf7FoGK9ITVfN9SR+ajOqKS/sWdwDb28HHZfH0Wfpby++zrwdr59y72efbxfXb91/L57P1G/8uOM9gP+8EADMAADMAADMAADMDA4zBAoIJAxcCErE/InqO5l49tT187cwg+iJocmXr9SeHwl431ahK9suQRbDvpPf82hXST7v7pEeWR1uedt81kY71+Zx7ksrKzMnfgp9W+78szbovhS+bfK9vnGcf0lXS+Bp+vZA/6suy4gp2wEwzAAAzAAAzAAAzAAAw8JgMEKghUEKiAARiAARiAARiAARiAARiAARiAARiAARiAARiAARiAgbsxQKAC+O4GH9HLx4xeMi6MCwzAAAzAAAzAAAzAAAzAAAzAAAzAAAzAAAzAwFcyQKCCQAWBChiAARiAARiAARiAARiAARiAARiAARiAARiAARiAARi4GwMEKoDvbvCtjcilD+wW76HvyeId6beNAI/vCT9zXHrjpvzW+I1tH79xce43LC6tbzq29FMfSG/H4DiG8DccbmSDe/E7ju3K+c38vHzejWNwB7bGthn/pztXu9ea8ZXtXoPPr9SXti5fD7EhNoQBGIABGIABGICB2zKQAhUzJ9sFF4MM1m0H61HtW16o2UdXz3UWn9O31YGK/Xb1hf7mYzd82ty4g6PmHNusLbvdXzZmIwM3sk9aoxaM36X9WFt/qX7l+IxcHdddfbA4+uB4WfeV/q+1u2wAf5/DYcH8kL18+kzH/7WcrJ2fZqdnso8fV7+91m6Scev5pXZ66dp+XDL+plM653Br9C3Pb3o2OCd/HDen++GwH7abzepzoXPav1bZteN+rfaXynkWPZf2h3LveU3HuDPuMAADMAADMAAD92ZgClSs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",
//   },
//   comments: COMMENTS,
// };
