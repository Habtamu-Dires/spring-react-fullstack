import React, {useState, useEffect} from 'react';
import {deleteStudent, getAllStudents} from "./client";
import './App.css';
import {  FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined,
              TeamOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Spin, Menu, Layout, Button, Empty, Table, Radio, message,
         Breadcrumb, theme, Badge, Tag, Avatar, Popconfirm} from 'antd';

import StudentDrawerForm from './StudentDrawerForm';
import { successNotification } from './Notification';


const { Header, Content, Footer, Sider } = Layout;



function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const TheAvatar = ({name})=>{
  let trim = name.trim();
  if(trim.length === 0){
    return <Avatar icon={<UserOutlined />}/>
  }
  const split = trim.split(" ");
  if(split.length === 1){
    return <Avatar>{name.charAt(0)}</Avatar>
  }
  return <Avatar>
    {`${name.charAt(0)}${name.charAt(name.length-1)}`}
  </Avatar>
}

const removeStudent = (id,fetchStudents) =>{
  deleteStudent(id)
  .then(()=>{
    successNotification(
      `Student deleted succesfuly`,
      `Student with id ${id} was deleted`
    )
    fetchStudents()
  });
}

const columns = (fetchStudents) => [
  {
    title:'',
    dataIndex: 'avatar',
    key: 'avatar',
    render: (text,student) => <TheAvatar name={student.name}/>
  },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, student) => 
      <Radio.Group>
        <Popconfirm
          placement='topRight'
          title={`Are you sure to delte ${student.name}`}
          onConfirm={()=>removeStudent(student.id, fetchStudents)}
          okText = 'Yes'
          cancelText= 'No'
        >
          <Radio.Button value={'small'}>Delete</Radio.Button>
        </Popconfirm>
          <Radio.Button value={'small'}>Edit</Radio.Button>
      </Radio.Group>
  }

];

const antIcon = (
  <LoadingOutlined  style={{ fontSize: 24, }} spin />
);

function App() {

  const [students, setStudents] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [fetching, setFetching] = useState(true);

  const[showDrawer, setShowDrawer] = useState(false);

  const { token: { colorBgContainer }, } = theme.useToken();

  const fetchStudents = () =>
      getAllStudents()
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setStudents(data);
        setFetching(false);
      });

  useEffect(()=>{
    fetchStudents();
  },[]);

  const renderStudents = () => {
    if(fetching){
      return <Spin indicator={antIcon} />
    }
    if(students.length <= 0){
      return <Empty />;
    } 
    return <>
      <StudentDrawerForm 
        setShowDrawer={setShowDrawer}
        showDrawer={showDrawer}
        fetchStudents={fetchStudents}
      />
      <Table 
        dataSource={students} 
        columns={columns(fetchStudents)} 
        bordered
        title={() =>
        <>  
          <Tag>Number of students</Tag>
          <Badge 
              count={true ? students.length : 0}  
              style={{
                margin: '10px'
              }}
          />
          <br/>
          <Button 
            onClick={()=> setShowDrawer(!showDrawer)}
            type="primary" shape="round" icon={<PlusOutlined />} size={"small"}>
              Add New Student
          </Button>
        </>
        }
        pagination={{ pageSize: 50, }}
        scroll={{ y: 500,}}
        rowKey={(student) => student.id}
       />
    </>
  }

  return (
    <Layout style={{ minHeight: '100vh', }} >

    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
    </Sider>

    <Layout>

      <Header style={{ padding: 0, background: colorBgContainer, }} />
      <Content style={{ margin: '0 16px', }} >

        <Breadcrumb style={{ margin: '16px 0', }} >
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, }} >
          {renderStudents()}
        </div>

      </Content>
      <Footer style={{ textAlign: 'center',}} >
        By amigoscode
      </Footer>
    </Layout>
  </Layout>
  )
 
}

export default App;
