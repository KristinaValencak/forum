import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import '../Styles/Thread.css';

function Thread() {
  const { thread_id } = useParams();
  const answerInputRef = useRef(null);
  console.log('Thread ID:', thread_id);
  const [threadTitle, setThreadTitle] = useState(null);
  const [posts, setPosts] = useState(null);
  const [showNewAnswerInput, setShowNewAnswerInput] = useState(false);
  const [newAnswerContent, setNewAnswerContent] = useState('');

  useEffect(() => {
    if (thread_id) {
      fetch(`http://localhost:8081/posts/${thread_id}`)
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.posts);
          setThreadTitle(data.thread_title);
          console.log(data.posts);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [thread_id]);

  function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    const formattedDateTime = `${hours}:${minutes} ${day}-${month}-${year}`;
    return formattedDateTime;
  }

  const handleNewAnswerClick = () => {
    setShowNewAnswerInput(true);
  };


  const handleAnswerInputChange = (e) => {
    setNewAnswerContent(e.target.value);
  };

  const handleAnswerSubmit = () => {
    const accessToken = localStorage.getItem('accessToken');
    const newPost = {
      post_content: newAnswerContent,
    };

    fetch(`http://localhost:8081/createPost/${thread_id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })

    
    console.log('New Answer Content:', newAnswerContent);

    
    const newAnswer = {
      id: posts.length + 1, 
      post_content: newAnswerContent,
      
    };
    setPosts(posts ? [...posts, newAnswer] : [newAnswer]); 
    setShowNewAnswerInput(false);
    setNewAnswerContent(''); 
  };

  return (
    <div>
      <Header />
      <div className="post-title">{threadTitle}</div>
      <div className='newAnswer'>
      <button className="answerbutton" onClick={handleNewAnswerClick}>
        Answer
      </button>
      </div>
      <div className="containerPosts">
      <div ref={answerInputRef}></div>
        {showNewAnswerInput && (
          <div className="box-post">
            <input
              type="text"
              placeholder="Enter your answer..."
              value={newAnswerContent}
              onChange={handleAnswerInputChange}
            />
            <button onClick={handleAnswerSubmit} className='newanswerButton'>Submit</button>
          </div>
        )}
        {posts &&
          posts.map((post) => (
            <div key={post.id} className="box-post">
              <p className="post-content">{post.post_content}</p>
              <div className="post-footer">
                <div className="written-by">
                  Written by: {post.username} on {formatDateTime(post.post_date)}
                </div>
              </div>
            </div>
            
          ))}
        
       
      </div>
    </div>
  );
}

export default Thread;