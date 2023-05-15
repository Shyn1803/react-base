import React, { useEffect, useState } from "react";
import { Upload, Button, Form, Input, message } from "antd";
import ImgCrop from "antd-img-crop";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { updateUser } from "../../slices/user/userSlice";
import { RootState } from "@/redux/store";
import { AVATAR_DEFAULT_URL } from "../../utils/constant";

import MESSAGE from "../../utils/message";

import styles from "./styles.module.scss";

type FormValueProps = {
  email: string;
  password: string;
};

const USER_PROFILE_URL = "api/user";

export default function UserProfilePage() {
  const userStore: any = useSelector((state: RootState) => state.user);
  const [form] = Form.useForm();
  const axiosPrivate = useAxiosPrivate();

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [imageBase64, setImageBase64] = useState(
    userStore?.user?.image || AVATAR_DEFAULT_URL
  );

  const [fileList, setFileList] = useState<any[]>([]);

  const { SYSTEM_ERROR, UPDATE_SUCCESS } = MESSAGE;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    isMounted && getUserProfile(controller);

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserProfile = async (controller?: AbortController) => {
    try {
      const options: any = {};

      if (controller) {
        options.signal = controller?.signal;
      }

      await axiosPrivate.get(USER_PROFILE_URL, options).then((res: any) => {
        if ([200, 201].includes(res?.status)) {
          dispatch(updateUser(res?.data?.user || {}));
          form.setFieldsValue(res?.data?.user);
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

  const onFinish = async (values: FormValueProps) => {
    const userData = {
      ...values,
      image: imageBase64 === AVATAR_DEFAULT_URL ? "" : imageBase64,
    };

    try {
      await axiosPrivate.put(USER_PROFILE_URL, userData).then((res: any) => {
        if ([200, 201].includes(res?.status)) {
          messageApi.open({
            type: "success",
            content: UPDATE_SUCCESS(),
          });

          getUserProfile();
        }
      });
    } catch (err) {
      messageApi.open({
        type: "error",
        content: SYSTEM_ERROR(),
      });
    }
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList([newFileList?.at(-1)]);
    var file: any = newFileList?.at(-1);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        file.base64 = e?.target?.result;
        setImageBase64(e?.target?.result || "");
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  return (
    <div className={styles.userProfileContainer}>
      <h2>My Profile</h2>
      <div className="user-panel">
        <div className="left">
          <ImgCrop rotationSlider>
            <Upload
              onChange={onChange}
              onPreview={onPreview}
              fileList={fileList}
              customRequest={dummyRequest}
            >
              <div className="avatar-wrapper">
                <img src={imageBase64} alt="user-avatar" />
              </div>
            </Upload>
          </ImgCrop>
        </div>
        <div className="right">
          <Form
            name="user-profile-form"
            className="user-profile-form"
            form={form}
            initialValues={userStore?.user}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item className="form-item" label="Username" name="username">
              <Input />
            </Form.Item>

            <Form.Item className="form-item" label="Email" name="email">
              <Input />
            </Form.Item>

            <Form.Item className="form-item" label="Bio" name="bio">
              <Input />
            </Form.Item>

            <Form.Item className="form-actions">
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      {contextHolder}
    </div>
  );
}
