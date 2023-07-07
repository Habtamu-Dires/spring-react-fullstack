import React,{useState} from "react";
import { LoadingOutlined } from "@ant-design/icons";
import {  Button, Col, Spin, Drawer, Form, Input, Row, Select, Space
} from 'antd';

import { addNewStudent } from "./client";
import { successNotification, errorNotification } from "./Notification";

const { Option } = Select;

const antIcon = (<LoadingOutlined style={{ fontSize: 24, }} spin /> )


const StudentDrawerForm = ({showDrawer, setShowDrawer, fetchStudents}) => {

    const onClose = () => setShowDrawer(false);
    const [submitting, setSubmitting] = useState(false);

    const onFinish = student => {
        setSubmitting(true);
        console.log(JSON.stringify(student, null, 2));

        addNewStudent(student)
        .then(()=> {
            console.log("student added");
            onClose()
            successNotification(
              "Student successfuly added",
              `${student.name} was added to the system`
            );
            fetchStudents();
        })
        .catch(err => {
          console.log(err.response)
          err.response.json().then(res => {
            console.log(res);
            errorNotification(
              "There was an issue",
              `${res.message} [${res.status}] [${res.error}]`,
              "bottomLeft"
              );
          });
        })
        .finally(()=> {
            setSubmitting(false)
        });
       
    };
    const onFinishFailed = (errorInfo) => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    /*  const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    }; */
    /*  const onClose = () => {
        setOpen(false);
    }; */
  return (
    <>
      <Drawer
        title="Create a new student"
        width={720}
        onClose={onClose}
        open={showDrawer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            {/* <Button onClick={onClose}>Submit</Button> */}
          </Space>
        }
      >
        <Form layout="vertical" 
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            requiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter user name',
                  },
                ]}
              >
                <Input placeholder="Please enter user name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="email"
                rules={[
                  {
                    required: true,
                    message: 'Please enter email',
                  },
                ]}
              >
                <Input
                  placeholder="Please enter url"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="gender"
                rules={[
                  {
                    required: true,
                    message: 'Please select an gender',
                  },
                ]}
              >
                <Select placeholder="Please select an owner">
                  <Option value="MALE">MALE</Option>
                  <Option value="FEMALE">FEMALE</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
                <Form.Item>
                <Button  type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
            </Col>
          </Row>
          <Row>
            {submitting && <Spin indicator={antIcon} />}
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default StudentDrawerForm;