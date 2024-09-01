import React from 'react';

const Sidebar = () => {
  const chatRooms = ["General", "Tech Talk", "Random"];

  return (
    <div style={{ width: '250px', borderRight: '1px solid #ccc' }}>
      <h2>Chat Rooms</h2>
      <ul>
        {chatRooms.map((room, index) => (
          <li key={index}>{room}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
