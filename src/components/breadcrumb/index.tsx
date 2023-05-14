import React from "react";
import { Breadcrumb } from "antd";

import styles from "./styles.module.scss";

const BreadcrumbComponent = ({ items }: { items: any[] }) => {
  return (
    <div className={styles.breadcrumbContainer}>
      <Breadcrumb items={items} />
    </div>
  );
};

export default BreadcrumbComponent;
