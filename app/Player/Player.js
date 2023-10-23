'use client'
import React, { useState, useEffect, useRef } from "react";
import styles from './Player.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import SideBar from "./SideBar";

// import file from '../../'

const Player = ({setArtist,setTitle,artist, setSimilarSongs ,similarSongs,setFilePath, filePath ,title, prio, setPrio, suggestions}) => {
  const audioRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [nextFilePath, setNextFilePath] =  useState('')
  const [prevFilePath, setPrevFilePath] =  useState('')
  const [liked, setIsLiked] = useState(false);
  const [likeExist, setLikeExist] = useState(false)

  useEffect(() => {
    const songUrl = audioRef.current.src;
    
  const path = songUrl.split('/').slice(3).join('/');
  console.log("path value = " + songUrl)
      const graphqlQuery = {
        query: `
          query {
            isLikedSong(
              path: "${path}"
            ){
              exist
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
      }).then(res => {
        return res.json();
      }).then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error("liked song creation failed!");
          alert("liked song failed");
        }
        if (resData.errors) {
          console.log(resData);
          if (resData.errors[0].data[0].message) {
            alert("error occurred while creating liked song");
          }
          if (resData.errors[0].data[1].message) {
            alert("again liked song error");
          }
          throw new Error('liked song didnt work');
        }
        console.log(resData);
        setLikeExist(resData.data.isLikedSong.exist);
        // alert('Successfully checked the song');
      }).catch(error => {
        console.error(error);
      });
    // } else {
    //   console.log("inside liked-else query");
    // }
    
    },[liked, prio])
  

  useEffect(() => {
    console.log(liked +" == liked value");
    // Update audioDuration when the audio is loaded
    audioRef.current.addEventListener("loadeddata", () => {
      setAudioDuration(audioRef.current.duration);
    });

    // Update currentTime during playback
    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current.currentTime);
      console.log( currentTime);
    });
    
    
  }, [currentTime, liked]);

// Handle fav
const handleFav = () => {


  const songUrl = audioRef.current.src;
  const likedSongPath = songUrl.split('/').slice(3).join('/');

  console.log("printing current liked song " + likedSongPath);



    const graphqlQuery = {
      query: `
        mutation {
          likedSong(
            pathToLikedSong: "${likedSongPath}", artist: "${artist}", title: "${title}"
          ){
            message
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
    }).then(res => {
      return res.json();
    }).then(resData => {
      if (resData.errors && resData.errors[0].status === 422) {
        throw new Error("liked song creation failed!");
        alert("liked song failed");
      }
      if (resData.errors) {
        console.log(resData);
        if (resData.errors[0].data[0].message) {
          alert("error occurred while creating liked song");
        }
        if (resData.errors[0].data[1].message) {
          alert("again liked song error");
        }
        throw new Error('liked song didnt work');
      }
      console.log(resData);
      setIsLiked(true);
      // alert('Successfully liked the song');
      
  setIsLiked(!liked)
    }).catch(error => {
      console.error(error);
    });
  // } else {
  //   console.log("inside liked-else query");
  // }
};



  const handlePlay = (event) => {
      event.preventDefault();
    setIsPlaying(true);
    audioRef.current.play();
  };

  const handlePause = (event) => {
      event.preventDefault();
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const handlePrev = () => {
    setPrio(0);
    const type = localStorage?.getItem('type')
    const graphqlQuery = {
        query: `
          query {
            prevMusicPlayer(
              currentType: "${type}" 
            ){
              filePath
              type
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
        .then(res => {
          return res.json();
        })
        .then(resData => {
          if (resData.errors && resData.errors[0].status === 424) {
            throw new Error("Fetching next music data failed!");
          }
          if (resData.errors) {
            // console.log(resData.errors);
          }
          console.log(resData)
          setPrio(3);
          console.log(" PREV FILE PATH ==== === === === === "+resData.data.prevMusicPlayer.filePath)
          setPrevFilePath(resData.data.prevMusicPlayer.filePath)
          localStorage?.setItem('type', resData.data.prevMusicPlayer.type);
          setTitle(resData.data.nextMusicPlayer.title)
          setArtist(resData.data.nextMusicPlayer.artist)
          
    setIsLiked(!liked)
          // alert('Successfull.........prev.......fetched music data');
        })
        .catch(error => {
          // console.error(error);
          // setError('User creation failed');
        });
  
  };

  const handleNext = () => {
    setPrio(0);
    const type = localStorage?.getItem('type')
    const graphqlQuery = {
        query: `
          query {
            nextMusicPlayer(
              currentType: "${type}" 
            ){
              filePath
              type
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
        .then(res => {
          return res.json();
        })
        .then(resData => {
          if (resData.errors && resData.errors[0].status === 424) {
            throw new Error("Fetching next music data failed!");
          }
          if (resData.errors) {
            // console.log(resData.errors);
          }
          console.log("next music data  == "+resData)
          setPrio(2);
          console.log(" NEXT FILE PATH ==== === === === === "+resData.data.nextMusicPlayer.title)
          setNextFilePath(resData.data.nextMusicPlayer.filePath)
          setTitle(resData.data.nextMusicPlayer.title)
          setArtist(resData.data.nextMusicPlayer.artist)
          localStorage?.setItem('type', resData.data.nextMusicPlayer.type);
          
    setIsLiked(!liked)
        //   alert('Successfull.........next.......fetched music data');
        })
        .catch(error => {
          // console.error(error);
          // setError('User creation failed');
        });
  
  };

  ///////////////////////SIMILAR///////////////////////////////////////

  const [currentSong, setCurrentSong] = useState('');

  const getTitleFromPath = (path) => {
    const startIdx = path.lastIndexOf('/') + 1;
    const endIdx = path.lastIndexOf('.');
    const title = path.substring(startIdx, endIdx);
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const managePlay = (songPath) => {

    setIsLiked(!liked)

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
          alert('Failed to fetch music data');
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

  ///////////////////////SIMILAR////////////////////////////
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  return (
    <>
     <div className={styles.similar}>
      <ul>
        {similarSongs.map((song, index) => (
          <div className={styles.songList2} key={song.id} >
          <div className={isPlaying && currentSong === song ?styles.songList:null}>
          <li style={{ display: 'flex' }} key={index}>
          <div className={isPlaying && currentSong === song ?styles.songListBtn :  null}>
            <button onClick={() => managePlay(song)}>
              {currentSong === song && isPlaying ? '||' : '>'}
            </button>
            </div>
            &nbsp;{/* Insert a space */}
            <span style={{ textDecoration: 'yellow' }}><p>{getTitleFromPath(song)}</p></span>
          </li>
          </div>
          </div>
        ))}
      </ul>
      <audio ref={audioRef}></audio>
    </div>
{/* SIDE BAR - SIDE BAR */}
<SideBar suggestions={suggestions} setLikeExist={setLikeExist} setSimilarSongs={setSimilarSongs} />

     
    <div className={styles.thePlayer}>

        <div className={styles.seekbar} >
            <div className={styles.currentSeekbar} style={{ width: `${(currentTime / audioDuration) * 100}%` }} ></div>
        </div>

{/* LIKE BUTTON */}

<div className={styles.like}>
      <button  onClick={handleFav} className={(likeExist)? styles.heart_buttonRed : styles.heart_button}>
        <FontAwesomeIcon icon={faHeart} className={styles.icon} />
      </button>
    </div>

    {/* LIKE BUTTON */}

        <div className={styles.duration}>
            {audioDuration > 0 && (
            <p style={{ color: "white" }} >
                Duration: {formatTime(audioDuration)} | Current Time: {formatTime(currentTime)}
            </p>
            )}
       </div>
       {/* prio === 1 ? filePath : (prio === 2 ? nextFilePath : prevFilePath) */}
      <div className={styles.controls}>
      <audio src={prio === 1 ? filePath : (prio === 2 ? nextFilePath : prevFilePath) } ref={audioRef} ></audio>
            <div className="btn">
            <button
                className={styles.control_button}
                onClick={handlePrev}
                style={{ color: "black" }}
            >
                {'<-|'}
            </button>
            <button
                className={styles.control_button}
                onClick={isPlaying ? handlePause : handlePlay}
                style={{ color: "black" }}
            >
                {isPlaying ? "||" : ">"}
            </button>
            <button
                className={styles.control_button}
                onClick={() => (audioDuration === currentTime ? handleNext() : handleNext())}
                style={{ color: "black" }}
            >
                {'|->'}
            </button>
            </div>
        </div>
        
    </div>
    </>
  );
};

export default Player;
