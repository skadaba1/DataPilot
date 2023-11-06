import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Landing from './Landing.js';
import axios from 'axios';
import "./SessionsPage.css";

const session = "";

function SessionsPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [card, setCard] = useState([]);
  const [id, setId] = useState(0);

  const navigate = useNavigate();

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleClose = () => {
    closePopup();
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:4001/logs/all');
      setId(response.data.length + 1);
      const newData = response.data.map(element => ({
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
        name: element.name,
        des: element.task,
        but: "join session",
        id: element.id,
      }));
      setData(newData);
      console.log(newData)
      const newCard = newData.map(item => {
          return <Card image={item.img} name={item.name} des={item.des} but={item.but} session_id={item.id} />
      })
      console.log(newCard)
      setCard(newCard);
    } catch (error) {
      console.error(`There was an error retrieving the log list: ${error}`);
    } finally {
        setIsLoading(false);
    }
  }

  // Create new log 
  const handleLogCreate = async (desc, name) => {
    // Send POST request to 'books/create' endpoint
    try {
        const response = await axios
            .post('http://localhost:4001/logs/create', {
            session_content: "",
            name: name, 
            task: desc,
            });
    } catch (error) {
        console.error(`There was an error retrieving the log list: ${error}`);
    } 
}

  // Reset log list (remove all books)
  const handleLogReset = () => {
        // Send PUT request to 'books/reset' endpoint
        axios.put('http://localhost:4001/logs/reset')
        .then(() => {
        // Fetch all books to refresh
        // the books on the bookshelf list
     
        })
        .catch(error => console.error(`There was an error deleting the logs: ${error}`))
  }

      // for when new dataset is uploaded
    useEffect(() => {
        fetchLogs();
    }, [])


  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("ID in handleLogin = " + id);
    try {
        await handleLogCreate(desc, name);
        handleLogReset();
        closePopup();
        console.log("ID ABOVE NAVIGATE = " + id);
        navigate({
            pathname: `/${id}`,
          });
        //window.location.href = `/${id}`;
    } catch(error) {
        console.error(`There was an error retrieving the log list: ${error}`);
    }
  }

  return (
    <>
    {isLoading ? (
        <p>Loading...</p>
    ) : ( 
      <div>
      <h1 className="heading"> My Sessions </h1>
      <div className='header_underline'></div>
      <div className='wrapper'>
        <div className='card'>
          <img src="https://pngimg.com/d/plus_PNG96.png" />
          <h3> new session </h3>
          <p> Supported Environments: ipynb, py, csv </p>
          <button onClick={openPopup} className="btn">
            create session
          </button>
        </div>
        {card}
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <div className='x' onClick={closePopup}> x </div>
            <h2>CREATE NEW SESSION</h2>
            <div className='header_underline'></div>
            <form onSubmit={handleLogin}>
              <select id="dropdown">
                <option value="" disabled selected>Development Environment</option>
                <option value="option1">Notebook</option>
                <option value="option2">Code File</option>
                <option value="option3">Spreadsheet</option>
              </select>
              <label>
                <input type="text" placeholder="Session Name" onChange={e => setName(e.target.value)} />
              </label>
              <label>
                <textarea placeholder="What are you working on?" rows="4" type="text" onChange={e => setDesc(e.target.value)}></textarea>
              </label>
              <button type="submit">Create Session</button>
            </form>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
      </div>)}

    </>
  );
}

export default SessionsPage;
