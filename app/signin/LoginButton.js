import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 

const LoginButton = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Ensure this code only runs on the client side
    const token = localStorage.getItem('token');

    if (token) {
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
      .then(res => res.json())
      .then(res => {
        if (res.errors && res.errors[0].status === 420) {
          setIsAuthenticated(false);
        } else if (res.errors) {
          console.log(res.errors);
          throw new Error('User login failed');
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(error => {
        console.error(error);
        setIsAuthenticated(false);
      });
    }
  }, []); // Empty dependency array ensures this effect runs only once

  const handleSignOut = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/signout');
    localStorage.removeItem('email');
  };

  const handleClick = (event) => {
    event.preventDefault();
    router.push('/signin');
  };

  return (
    <button 
      onClick={isAuthenticated ? handleSignOut : handleClick}
      className="btn btn-outline-primary mr-2"
    >
      {isAuthenticated ? 'Sign Out' : 'Sign In'}
    </button>
  );
};

export default LoginButton;
