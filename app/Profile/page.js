'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import { FaCheckSquare } from 'react-icons/fa';
import { FaCamera } from 'react-icons/fa';

export default function App() {
  const [file, setFile] = useState();
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get user email from localStorage here
    const email = localStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append("email", userEmail);

    try {
      const response = await axios.post('http://localhost:8080/Profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageURL(`http://localhost:8080/images/` + response.data.imageName);
      console.log(response.data.imageName + " = =image name ");
      console.log(response);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  useEffect(() => {
    const fetchImageURL = async () => {
      if (userEmail) {
        try {
          const response = await axios.get(`http://localhost:8080/Profile/${userEmail}`);
          setImageURL(`http://localhost:8080/images/${response.data.imageName}`);
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }
      }
    };

    fetchImageURL();
  }, [userEmail]);

  return (
    <>
      <div className={styles.profileCont}>
        <div className={styles.upData}>
          <div className={styles.imageDiv}>
            <img src={imageURL} alt="Uploaded" />
            <div className={styles.formDiv}>
              <form onSubmit={submit}>
                <label htmlFor="fileInput" className={styles.customFileInput}>
                  <FaCamera />
                </label>
                <input
                  className={styles.fileInput}
                  id="fileInput"
                  filename={file}
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  accept="image/*"
                />
                {/* <input
                  onChange={e => setDescription(e.target.value)} 
                  type="text"
                ></input> */}
                <button type="submit">Upload</button>
              </form>
            </div>
          </div>
          <div className={styles.profiledata}>
            <h4>Name: {userEmail}</h4>
            <h4>Email: {userEmail}</h4>
            <h4>Country: India</h4>
            <h4>City: Patna</h4>
          </div>
        </div>
        <div className={styles.musicAndLoves}>
          <div className={styles.musicPreferences}>
            <h3>Music Preferences</h3>
            <ul>
              <li>
                <FaCheckSquare className={styles.checkboxIcon} /> Bollywood
              </li>
              <li>
                <FaCheckSquare className={styles.checkboxIcon} /> Pop
              </li>
              <li>
                <FaCheckSquare className={styles.checkboxIcon} /> Hindi
              </li>
              {/* Add more items here */}
            </ul>
          </div>

          <div className={styles.lovesToListen}>
            <h3>What I Love to Listen</h3>
            <ul>
              <li>Some favorite song</li>
              <li>Another favorite song</li>
              {/* Add more items here */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
