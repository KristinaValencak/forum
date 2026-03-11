import Header from '../components/Header'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import '../Styles/Forum.css'


function Forum() {
  const [threads, setThreads] = useState(null);
  const [showNewTopicInput, setShowNewTopicInput] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 


  const handleNewTopicClick = () => {
    setShowNewTopicInput(true);
  };

  const handleInputChange = (e) => {
    setNewTopicTitle(e.target.value);
  };

  const handleSearch = () => {
    fetch(`http://localhost:8081/search?term=${searchTerm}`)
      .then((res) => res.json())
      .then((searchResults) => {
        setThreads(searchResults);
      })
      .catch((error) => {
        console.error('Error searching:', error);
      });
  };


  const handleSubmit = () => {
    const accessToken = localStorage.getItem('accessToken');

    
    console.log('New Topic Title:', newTopicTitle);

    const newTopic = {
      thread_title: newTopicTitle,
    };

    fetch('http://localhost:8081/thread', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTopic),
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })

    

    setThreads([...threads, newTopic]); 
    setShowNewTopicInput(false); 
    setNewTopicTitle(''); 
  };

  useEffect(() => {
    fetch("http://localhost:8081/threads")
      .then((res) => res.json())
      .then(async (threads) => {
        const threadsWithReplyCount = await Promise.all(
          threads.map(async (thread) => {
            const response = await fetch(`http://localhost:8081/postsCount/${thread.thread_id}`);
            const data = await response.json();
            const replyCount = data[0]['count(*)'];
            return { ...thread, reply_count: replyCount };
          })
        );
        setThreads(threadsWithReplyCount);
      })
      .catch((error) => {
        console.error('Error fetching threads:', error);
      });
  }, []);

  return (
    <div>
      <Header />
      <div className='topic'>
        <button className='newtopic' onClick={handleNewTopicClick}>
          Add new topic
        </button>
        
        <div className='search-box'>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
       

        {showNewTopicInput && (
          <div className='box-class'>
           
            <input
              type='text'
              placeholder='Enter your new question...'
              value={newTopicTitle}
              onChange={handleInputChange}
            />
            <button onClick={handleSubmit} className='newtopicButton'>Submit</button>
          </div>
        )}
      </div>
      <div className='containerForum'>
        
      {Array.isArray(threads) && threads.length > 0 ? (
      threads.map((thread) => (
        <div key={thread.thread_id} className='box-class'>
          <Link to={`/thread/${thread.thread_id}`} key={thread.thread_id}>
            <p>{thread.thread_title}</p>
          </Link>
          <span className='reply-count'>{thread.reply_count} Answers</span>
        </div>
      ))
    ) : (
      <p>No threads available</p>
    )}
      </div>
    </div>
  );
}
export default Forum