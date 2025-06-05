import React from 'react';

const PostEditor = () => {
  return (
    <div>
      <textarea placeholder="Write your reply..." style={{width: '100%', minHeight: 100}} />
      <button>Post</button>
    </div>
  );
};

export default PostEditor; 