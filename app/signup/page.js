'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const Router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [id, setId] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (localStorage?.getItem('email')) {
      Router.push('/signin');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const graphqlQuery = {
      query: `
      mutation {
        createUser(
          userInput: {email : "${email}", name :"${username}", password: "${password}" 
        }){
            _id
            name
            email
          }
      }
      `,
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors && resData.errors[0].status === 422) {
          setError('Validation failed!');
          throw new Error('Validation failed!');
        }
        if (resData.errors) {
          console.log(resData);
          if (resData.errors[0].message) {
            setError(resData.errors[0].message);
          } else {
            setError('');
          }
          if (resData.errors[0].data) {
            if (resData.errors[0].data[0]) {
              setEmailError(resData.errors[0].data[0].message);
            } else {
              setEmailError('');
            }
            if (resData.errors[0].data[1]) {
              setPasswordError(resData.errors[0].data[1].message);
            } else {
              setPasswordError('');
            }
            throw new Error('User creation failed');
          }
        }
        console.log(resData);
        setId(resData.data.createUser);
        localStorage?.setItem('Name', resData.data.createUser.name);
        localStorage?.setItem('email', resData.data.createUser.email);
      })
      .catch((error) => {
        setIsErrorModalOpen(true);
        console.error(error);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {error && isErrorModalOpen && (
        <Modal isOpen={isErrorModalOpen} toggle={closeModal}>
          <div className="error">{error}</div>
          {passwordError && <div className="error">{passwordError}</div>}
          {emailError && <div className="error">{emailError}</div>}
          <Button color="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formField}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formActions}>
          <button type="submit">Signup</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
