'use client'
import Image from 'next/image';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import LoginButton from './signin/LoginButton';
import SignUp from './signup/SignUp';
import { useRef } from 'react';
import Player from './Player/Player';
import Artist from './Player/Artist';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Similar from './Player/Similar'
import Link from 'next/link'

// import Portal from './Portal/portal'

export default function Home() {

  const audioRef = useRef();

  const suggestions =
   ['Honor to the end','Past Lives (Slowed & Reverb)','Perfect (Slowed & Reverb)','Shinunoga EWa','The Dark Knight','Time','Honor him','Gangsta paradise','Dune','Cupid' ,'First Flight', 'Pirates Of Carribean', 'Can you hear the music', 'Dream is collapsing'];

  const [showDiv, setShowDiv] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [filePath, setFilePath] =  useState('')
  const [prio, setPrio] = useState(1);
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('')
  const [similarSongs, setSimilarSongs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
const [timer, setTimer] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [error, setError] = useState('');
const [imagePath, setImagePath] = useState('');
const [serverConnectionError, setServerConnectionError] = useState('');
const [serverStatusOnline, setServerStatusOnline] = useState(true)

  useEffect(() => {
    const serverUrl = 'http://localhost:8080';

    fetch(serverUrl)
      .then((response) => {
        console.log("response" + response)
        if (!response.ok) {
          
          setServerConnectionError(
            setServerStatusOnline(false)
          );
        }
      })
      .catch((error) => {
        setServerStatusOnline(false)
      });
  }, []);

  useEffect(()=>{
    const token = localStorage?.getItem('token')
    if(!token)
    setIsModalOpen(true)
  },[token])

fetch('http://localhost:8080/graphql', {
  method: 'POST',
  headers: {
    Authorization: 'bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      query {
        authentication
      }
    `,
  }),
})
.then(res=>{
  return res.json();
}).then(res => {
  console.log(res);
  if(res.erros && res.errors[0].status===420){
    setIsAuthenticated(false);
  }
  if (res.errors) {
    console.log(res.errors);
    throw new Error('User login failed');
  }
  setIsAuthenticated(true);
})
.catch(error => {
  console.error(error);
  setIsAuthenticated(false);
});

 useEffect(() => {
      const token = localStorage?.getItem('token');
    
      if (!token) {
        setTimer(setTimeout(() => {
          setIsModalOpen(true);
        }, 300)); // 5000 milliseconds (5 seconds)
      }
    
      return () => clearTimeout(timer); // Clear the timer on component unmount
    }, [timer]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);


    // Filter suggestions based on input value
    const filtered = suggestions.filter(suggestion =>
      suggestion.replace(/\s+/g, '').toLowerCase().includes(inputValue.replace(/\s+/g, '').toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };
///////////////////////
useEffect(() => {
  const handleSearch = () => {
    const type = localStorage?.getItem('type')
    setInputValue('')
    setPrio(0);
     // Show the conditional div
    const graphqlQuery = {
      query: `
        query {
          musicPlayer(
            songTitle: "${inputValue}"
            currentType: "${type}"
        
          ){
            filePath
            type
            artist
            title
            similarSongs
            image
          }
        }
      `
    };
  
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        
        
        if (resData.errors && resData.errors[0].status === 424) {
          alert('failed 1')
          throw new Error("Fetching music data failed!");
        }
        if (resData.errors) {
          console.log(resData.errors)
          alert('failed 2')
          setShowDiv(false);
          setError(resData.errors[0].message)
          setIsErrorModalOpen(true)
        }else{
        console.log("similar songs data "  +resData)
        setPrio(1);
        setFilePath(resData.data.musicPlayer.filePath)
        setArtist(resData.data.musicPlayer.artist)
        setTitle(resData.data.musicPlayer.title)
        console.log(resData.data.musicPlayer.similarSongs);
        setSimilarSongs(resData.data.musicPlayer.similarSongs)
        setImagePath(resData.data.musicPlayer.image)
        localStorage?.setItem('type' , resData.data.musicPlayer.type)
        setShowDiv(true);
      }
      })
      .catch(error => {
        setShowDiv(false);
        console.error("errro at searching "+error);
        // setError('User creation failed');
      });
  };
})


const handlePlay = (event) =>{
  event.preventDefault();
  audioRef.current.play();
}

  const handlePause = (event) =>{
    event.preventDefault();
    audioRef.current.pause();
  }


  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);

  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setIsErrorModalOpen(false)
  };
  
////////////////////////////
  return (
    <>
   {serverStatusOnline ? (
    <div className="body" >
    {/* <Portal/> */}
    {isModalOpen  && (
 <Modal isOpen={isModalOpen} toggle={closeModal}>
 <div className="bodyModal">
  {/* Text and Image Section */}
  {/* <div className="textImageSection"> */}
    <div className="text">
      <h2>Hello folks...this is faisal irfan here</h2>
      <p>I wanna dictate this app to my music idol hans zimmer whose music i love and admire to extent 
      whose music is like heaven to my ears and i love to listen in my all kind of moods....this application is for sir hans zimmer
      Thank you for your contribution your music to this society and thanks for your <bold>Time</bold> for us</p>
    </div>
    <div className="image">
      <img src="path-to-your-hans-zimmer-image" alt="Hans Zimmer" />
    </div>
  {/* </div> */}
  </div>
      </Modal>
)}

       <nav className="navbar navbar-expand-lg navbar-light navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Spoti-Clone</a>
          <div className="ml-auto">
            <LoginButton />
           { !isAuthenticated?<SignUp />:null}
          </div>
          {isAuthenticated ? (
      <Link href="/Profile"> {/* Replace "/profile" with your actual profile page URL */}
        <div className="profile">
          {localStorage?.getItem('email') && localStorage?.getItem('email')[0].toUpperCase()}
        </div>
      </Link>
    ) : null}
        </div>
      </nav>
      {/* <audio src={'/music/dune.mp3'} controls ></audio> */}
     
      <div>
      <div>
        <div className="theForm">
          <form>
            <input 
              placeholder='Search music, album, artist'
              value={inputValue}
              onChange={handleInputChange}
            />
            <div className="btn">
              <button onClick={handleSearch} type="button">Search</button>
            </div>
            {inputValue && (
              <div className="suggestions">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
     
      {showDiv && !error && (
  <div className="conditionalDiv">
    {/* <Similar setPrio={setPrio} setFilePath={setFilePath} setArtist={setArtist} setTitle={setTitle} similarSongs={similarSongs} /> */}
    <Artist imagePath={imagePath} artist={artist} title={title} />
  </div>
)}

{error && isErrorModalOpen && (
  <Modal isOpen={isErrorModalOpen} toggle={closeModal}>
    <div className="error">
      {error}
    </div>
    <Button color="secondary" onClick={closeModal}>Close</Button>
  </Modal>
)}
      </div>
      {/* <button onClick={handlePlay} >play-audio</button>
      <hr/>
      {console.log("FILEPATH ======== "+filePath)}
      <button onClick={handlePause} >pause-audio</button> */}
      {!inputValue && filePath && (
        <div className="audioDiv">
          <Player  imagePath={imagePath} suggestions={suggestions} title={title} artist={artist} setArtist={setArtist} setTitle={setTitle} setSimilarSongs={setSimilarSongs} similarSongs={similarSongs} filePath={filePath} setPrio={setPrio} prio={prio} />
        </div>
      )}
      </div>) : (
        <div>
    <h6>Unable to connect to the server</h6>
    <br />
    <ul>
    <li> try relaodin this page</li>
      <li>Can not establish a connection to the server at  <span style={{ fontWeight: 'bold' }}>localhost:8080</span>.</li>
      <li>Check your computer’s network connection.</li>
      <li>Make sure your browser is permitted to access the web.</li>
      <li> Server could be offline</li>
    </ul>
    <br />
    <br />
    <h4>Contact the author at the email address faisalirfan2502@gmail.com</h4>
  </div>

    )}
    </>
  );
}
