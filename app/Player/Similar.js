import React, { useState } from 'react';
import styles from './Similar.module.css';
import { useRef } from 'react';

const Similar = ({ similarSongs, setArtist, setTitle, setFilePath, setPrio}) => {
  const audioRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState('');

  const getTitleFromPath = (path) => {
    const startIdx = path.lastIndexOf('/') + 1;
    const endIdx = path.lastIndexOf('.');
    const title = path.substring(startIdx, endIdx);
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const managePlay = (songPath) => {

    if (currentSong === songPath) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying); // Toggle isPlaying
      } else {
        setCurrentSong(songPath);
        audioRef.current.src = songPath;
        audioRef.current.play();
        setIsPlaying(true); // Set isPlaying to true since the song is playing now
      }
    
    

    const type = localStorage?.getItem('type');
    const formattedSongTitle = getTitleFromPath(songPath);
    
    const graphqlQuery = {
      query: `
        query {
          musicPlayer(
            songTitle: "${formattedSongTitle}"
            currentType: "${type}"
          ){
            artist
            title
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
      .then(res => res.json())
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 424) {
          throw new Error("Fetching music data failed!");
        }
        if (resData.errors) {
        //   alert('Failed to fetch music data');
        } 
        
          setArtist(resData.data.musicPlayer.artist);
          setTitle(resData.data.musicPlayer.title);
          setFilePath(songPath)
          setPrio(1);
        
      })
      .catch(error => {
        console.error(error);
      });
    
    //   setIsPlaying(!isPlaying);
  }

    
  

  return (
    <div className={styles.similar}>
      <ul>
        {similarSongs.map((song, index) => (
          <li key={index}>
            <button onClick={() => managePlay(song)}>
              {currentSong === song && isPlaying ? '||' : '>'}
            </button>
            &nbsp;{/* Insert a space */}
            <span><h5>{getTitleFromPath(song)}</h5></span>
          </li>
        ))}
      </ul>
      <audio ref={audioRef}></audio>
    </div>
  );
};

export default Similar;