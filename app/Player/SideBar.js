import React, { useState } from "react";
import styles from './SideBar.module.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const SideBar = ({ artist,title,filePath,setIsLiked, setLikeExist, setSimilarSongs, suggestions, handleSuggestionClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleLike = () => {
    const graphqlQuery = {
      query: `
        query {
          likedSongFetcher{
            likedSongArray 
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
        throw new Error("liked song fetching  failed!");
        alert("liked song failed");
      }
      if (resData.errors) {
        console.log(resData);
        if (resData.errors[0].data[0].message) {
          alert("error occurred while fetching liked song");
        }
        if (resData.errors[0].data[1].message) {
          alert("again liked song error");
        }
        throw new Error('liked song didnt work');
      }
      console.log("liked song fetched "+resData);
      console.log(resData);
      console.log(resData.data.likedSongFetcher.likedSongArray);
      setSimilarSongs(resData.data.likedSongFetcher.likedSongArray)
      setLikeExist(true)
      
      // alert('Successfully fetched liked the song');
    }).catch(error => {
      console.error(error);
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    // Filter suggestions based on input value
    const filtered = suggestions.filter(suggestion =>
      suggestion.replace(/\s+/g, '').toLowerCase().includes(inputValue.replace(/\s+/g, '').toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleAdd = (e) => {
    e.preventDefault();
alert('adding processing')
    const graphqlQuery = {
      query: `
        mutation {
          AddlikedSong(
           title: "${inputValue}"
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
      alert('Successfully liked the song');
    }).catch(error => {
      console.error(error);
    });

  }

  return (
    <div className={styles.sideBar}>
      <div className={styles.likedSongs}>
        <button onClick={handleLike}>Liked Songs</button>
      </div>
      <div className={styles.loveBtn} >
      <button onClick={openModal}>Add to <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} /></button>
      </div>
      <Modal isOpen={isModalOpen} toggle={closeModal}>
      <div className={styles.modalBody}>
        <h3>Add your favourate songs..</h3>
        <ModalBody>
          <input
            type="text"
            placeholder="Type here to search and add..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <ul>
            {filteredSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
          <div className={styles.addButton}>
          <button onClick={handleAdd} >
          Add Your Song
        </button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>Cancel</Button>
        </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};

export default SideBar;
