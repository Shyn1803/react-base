import React from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';

type Props = { className?: string; }

const LoadingComponent = (props: Props) => {
  const { className } = props;

  const loadingComponentClassName = classNames(
    styles.loadingContainer,
    className
  );

  return (
    <div className={loadingComponentClassName}>
      <Spin />
    </div>
  );
};

export default LoadingComponent;
