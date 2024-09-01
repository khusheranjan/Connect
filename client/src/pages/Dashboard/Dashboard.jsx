import React from 'react'
import useUser  from '../../Context.jsx'
import Sidebar from '../../components/Sidebar.jsx';
import ChatArea from '../../components/ChatArea.jsx';

const Dashboard = () => {
    const {userData} = useUser();
  return (
    <>
    <div>{userData.name}</div>
    <div>
      <Sidebar/>
      <ChatArea/>
    </div>
    </>
  )
}

export default Dashboard