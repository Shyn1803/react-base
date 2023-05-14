import React, { useEffect, useState } from "react";
import { message, Button } from "antd";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../slices/articles/articlesSlice";
import dayjs from "dayjs";

import MESSAGE from "../../utils/message";

import styles from "./styles.module.scss";

const ARTICLES_URL = "api/articles";

export default function ArticlePage() {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [articles, setArticles] = useState<Array<any>>([]);

  const { SYSTEM_ERROR, DELETE_SUCCESS, DELETE_FAILED } = MESSAGE;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    isMounted && getArticles(controller);

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getArticles = async (controller?: AbortController) => {
    try {
      const options: any = {};

      if (controller) {
        options.signal = controller?.signal;
      }

      dispatch(showLoading());
      await axiosPrivate
        .get(ARTICLES_URL, options)
        .then((res) => {
          if (res?.status === 200) {
            setArticles(res?.data?.articles || []);
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

  const redirectToDetail = (slug: string) => {
    navigate(`/article/detail/${slug}`);
  };

  const redirectToAddNew = () => {
    navigate(`/article/new`);
  };

  const redirectToEdit = (e: any, slug: string) => {
    e.stopPropagation();
    navigate(`/article/edit/${slug}`);
  };

  const handleDeleteArticle = async (e: any, slug: string) => {
    e.stopPropagation();
    if (slug) {
      try {
        await axiosPrivate
          .delete(`${ARTICLES_URL}/${slug}`)
          .then((res: any) => {
            if (res?.status === 200) {
              messageApi.open({
                type: "success",
                content: DELETE_SUCCESS(),
              });
            }

            const controller = new AbortController();
            getArticles(controller);
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

  const formatDate = (date: Date) => {
    return dayjs(date).format("MMM DD, YYYY");
  };

  return (
    <div className={styles.articlePageContainer}>
      <div className="header-wrapper">
        <h2>Article List</h2>
        <Button type="primary" onClick={() => redirectToAddNew()}>
          New article
        </Button>
      </div>
      <div className="article-scroll-wrapper">
        {articles?.map((article: any) => {
          return (
            <div
              className="article-card"
              onClick={() => redirectToDetail(article?.slug)}
            >
              <div className="title">{article?.title}</div>
              <div className="separate"></div>
              <div className="description">{article?.description}</div>
              <div className="actions">
                <Button
                  type="primary"
                  onClick={(e) => redirectToEdit(e, article?.slug)}
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={(e) => handleDeleteArticle(e, article?.slug)}
                >
                  Delete
                </Button>
              </div>
              <div className="more-info">
                <div className="tags">
                  {article?.tagList?.map((tag: string) => {
                    return <div className="tag-wrapper">{tag}</div>;
                  })}
                </div>
                <div className="date-time">
                  {formatDate(new Date(article?.updated))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {contextHolder}
    </div>
  );
}
