import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import HomePage from "../../pages/homePage";
import AdminLayout from "../adminLayout/adminLayout";
import LoginPage from "../../pages/loginPage";
import UserPage from "../../pages/userPage";
import NotFoundPage from "../../pages/NotFoundPage";
import UserProfilePage from "../../pages/userProfilePage";
import ArticlePage from "../../pages/articlePage";
import ArticleDetailPage from "../../pages/articleDetailPage";
import ArticleEditPage from "../../pages/articleEditPage";
import ArticleNewPage from "../../pages/articleNewPage";
import SignUpPage from "../../pages/signUpPage";

import styles from "./styles.module.scss";

const BlankLayout = () => {
  const userStore: any = useSelector((state: RootState) => state.user);

  return (
    <div className="blank-layout-container">
      {userStore?.user?.id ? (
        <AdminLayout>
          <Content />
        </AdminLayout>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      )}
    </div>
  );
};

function Content() {
  return (
    <div className={styles.blankLayoutContainer}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/article" element={<ArticlePage />} />
        <Route path="/article/detail/:slug" element={<ArticleDetailPage />} />
        <Route path="/article/edit/:slug" element={<ArticleEditPage />} />
        <Route path="/article/new" element={<ArticleNewPage />} />
        <Route path="/profile" element={<UserProfilePage />} />

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default BlankLayout;
