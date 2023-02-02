import { useState, useEffect } from 'react';
import { Card, Col } from 'react-bootstrap';
import Axios from 'axios';
import './App.css';
import { ArticleInterface } from './interfaces';

const App = () => {

  const [posts, setPosts] = useState<ArticleInterface[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<ArticleInterface[]>(posts);

  const ARTICLES_URL = 'https://jsonplaceholder.typicode.com/posts';
  const DEBOUNCE_TIME = 300;

  const fetchData = async (url: string) => {
    try {
      const response = await Axios.get<ArticleInterface[]>(url);

      setPosts(
        response.data.map((post) => ({
          ...post,
          date: createDate(),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { 
    fetchData(ARTICLES_URL); 
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredPosts(
        posts.filter(post =>
          post.title.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }, DEBOUNCE_TIME);
    return () => clearTimeout(timeout);
  }, [searchInput, posts]);

  const createDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`
  };

  return (
    <div>
      <h2 className="text-center">Articles</h2>
      <div className="search-container">
        <label htmlFor="search-input">Search articles by title: </label>
        <input
            name="search-input"
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
        />
      </div>
      <div>
        {filteredPosts.map((post) => (
          <Col key={post.id}>
              <Card>
                <Card.Body>
                  <Card.Title className="font-weight-bold text-center">
                    {post.title}
                  </Card.Title>
                  <Card.Text className="text-justify">{post.body}</Card.Text>
                  <Card.Text className="text-justify">{post.date}</Card.Text>
                </Card.Body>
              </Card>
          </Col>
        ))}
      </div>
    </div>
  );
}

export default App;
