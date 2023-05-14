import React from "react";
import { Spin } from "antd";
import classNames from "classnames";

import styles from "./styles.module.scss";

type Props = {
  className?: string;
  isEdit?: boolean;
  value?: string;
  onChange?: Function;
};

const CommentDescriptionComponent = (props: Props) => {
  const { className, isEdit = true, value, onChange } = props;

  const commentDescriptionComponentClassName = classNames(
    styles.loadingContainer,
    className
  );

  const handleOnChange = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={commentDescriptionComponentClassName}>
      {isEdit ? (
        <input
          defaultValue={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChange(e?.target?.value)}
        ></input>
      ) : (
        value
      )}
    </div>
  );
};

export default CommentDescriptionComponent;
