import React from 'react';

const Tag = ({ label, color }: { label: string; color: string }) => {
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', marginRight: 4 }}>
      {label}
    </span>
  );
};

export default Tag; 