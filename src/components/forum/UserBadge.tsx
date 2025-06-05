import React from 'react';

const UserBadge = ({ role }: { role: string }) => {
  return (
    <span style={{ background: '#333', color: '#ffd700', borderRadius: 4, padding: '2px 8px', marginLeft: 4 }}>
      {role}
    </span>
  );
};

export default UserBadge; 