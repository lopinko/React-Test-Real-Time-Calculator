import React, { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null); // Melyik posztról kérünk több infót -> More Info
  const [commentPostId, setCommentPostId] = useState(null); // Melyik poszt kommentjei látszanak -> Show/ Hide Comments

  useEffect(() => {
    // Posztok, felhasználók és kommentek fetch-elése
    Promise.all([
      fetch('https://jsonplaceholder.typicode.com/users'),
      fetch('https://jsonplaceholder.typicode.com/posts'),
      fetch('https://jsonplaceholder.typicode.com/comments'),
    ])
      .then(async (res) => {
        const users = await res[0].json();
        const posts = await res[1].json();
        const comments = await res[2].json();
        return [users, posts, comments];
      })
      .then(([users, posts, comments]) => {
        setUsers(users);
        setPosts(posts);
        setComments(comments);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Felhasználó adatainak lekérése id alapján
  const getUserDetailsById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user || {};
  };

  // Felhasználó posztjainak száma
  const getUserPostCount = (userId) => {
    return posts.filter((post) => post.userId === userId).length;
  };

  // Kommentek lekérése egy poszthoz
  const getCommentsByPostId = (postId) => {
    return comments.filter((comment) => comment.postId === postId);
  };

  // More Info -> információk mutatása
  const handleToggleClick = (id) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  // Show Comments -> kommentek mutatása
  const handleCommentsToggle = (id) => {
    setCommentPostId(commentPostId === id ? null : id);
  };

  return (
    <div>
      {posts.map((post) => {
        const user = getUserDetailsById(post.userId); //Felhasználó adatainak renderelése a posztokhoz
        const postComments = getCommentsByPostId(post.id); // Kommentek renderelése a posztokhoz
        const userPostCount = getUserPostCount(post.userId); // Posztok számának renderelése

        return (
          <div key={post.id}>
            <ol>
              <h4>{post.id}</h4>
              <p><b>Title:</b> {post.title}</p>
              <p><b>Post:</b> <i>{post.body}</i></p>
              {/* Szerző neve és posztjainak száma */}
              <p><b>Posted by:</b> {user.name || 'Unknown User'} ({userPostCount} posts)</p>

              {/* More Info gomb  */}
              <button onClick={() => handleToggleClick(post.id)}>
                {expandedPostId === post.id ? 'Less' : 'More'} Info
              </button>

              {/*  More Info -> megjelenés */}
              {expandedPostId === post.id && (
                <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <h5>User Details</h5>
                  <p><b>User ID:</b> {user.id}</p>
                  <p><b>Name:</b> {user.name}</p>
                  <p><b>Username:</b> {user.username}</p>
                  <p><b>Email:</b> {user.email}</p>
                  <p><b>Address:</b> {user.address?.street}, {user.address?.city}</p>
                  <p><b>Phone:</b> {user.phone}</p>
                  <p><b>Website:</b> {user.website}</p>
                  <p><b>Company:</b> {user.company?.name}</p>
                </div>
              )}

              {/* Show Comments gomb */}
              <button onClick={() => handleCommentsToggle(post.id)}>
                {commentPostId === post.id ? 'Hide Comments' : 'Show Comments'}
              </button>

              {/* Show Comments -> megjelenés */}
              {commentPostId === post.id && (
                <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <h5>Comments ({postComments.length})</h5>
                  {postComments.map((comment) => (
                    <div key={comment.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
                      <p><b>Comment ID:</b> {comment.id}</p>
                      <p><b>Name:</b> {comment.name}</p>
                      <p><b>Email:</b> {comment.email}</p>
                      <p><b>Comment:</b> {comment.body}</p>
                    </div>
                  ))}
                </div>
              )}

              <hr />
            </ol>
          </div>
        );
      })}
    </div>
  );
}
