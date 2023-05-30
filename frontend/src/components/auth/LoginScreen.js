import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../common/Message1';
import Loader from '../common/Loader';
import { login } from '../../apiRequest/actions/userActions';
import { Form } from 'react-bootstrap';
import jwt_decode from "jwt-decode";
import TwitterLogin from  "react-twitter-login"
import './login.css'


const LoginScreen = () => {
  const myStyle = {
    /* fallback for old browsers */
    background: '#6a11cb',

    /* Chrome 10-25, Safari 5.1-6 */
    background:
      '-webkit-linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))',

    scale: '0.85',
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const searchParams = new URLSearchParams(useLocation().search);
  const redirect = searchParams.get('redirect') || '/';

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  function handleGoogleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject)
    // For Google authentication
    fetch(`/social-auth/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auth_token: response.credential }), // Replace idToken with the actual token from Google
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        console.log(response.json())
        return response;
      })
      .then(data => {
        console.log(data)
        // Dispatch a login action with the user info
        dispatch(login(userObject.email, 'BRzCuF())Un!6cE8atX#VHj7'));
      })
      .catch(error => {
        // Handle errors here
        console.log('error')
        console.log(error)
      });
  }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: "1036092188931-h0uog1a6qkqsljcjemdpeoa60vs9hc7r.apps.googleusercontent.com",
      callback: handleGoogleCallbackResponse
    });
  }, []);
  const authHandler = (error, data) => {
    if (error) {
      console.log("Twitter login error:", error);
    } else {
      console.log("Twitter login data:", data);
      // Handle the successful login here
    }
  };
const handleGoogleSignIn = () => {
  google.accounts.id.prompt((response) => {
    if (response.status === "OK") {
      // The user has signed in successfully.
      console.log("Google Sign-In success:", response);
    } else {
      // The user has not signed in.
      console.log("Google Sign-In failed:", response);
    }
  }, { promptParentId: 'google-signin-prompt' }); // add the promptParentId option
};


const handleFBCallbackResponse = (response) => {
  console.log("Facebook login access token: ", response.authResponse.accessToken);
  const auth_token = response.authResponse.accessToken;
  if (response.status === "connected") {
    // Use the Facebook SDK to retrieve the user's basic profile information
    FB.api("/me", { fields: "name,email,id,picture.width(200)" }, function(response) {
      console.log("Facebook user profile: ", response);
      const userObject = {
        name: response.name,
        email: response.email,
        facebookId: response.id,
        profilePictureUrl: response.picture.data.url
      };
    fetch(`/social-auth/facebook/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auth_token: auth_token }), // Replace idToken with the actual token from Google
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        // Dispatch a login action with the user info
        dispatch(login(userObject.email, 'BRzCuF())Un!6cE8atX#VHj7'));
      })
      .catch(error => {
        // Handle errors here
        console.log('error')
        console.log(error)
      });
    });
  }
};

  useEffect(() => {
    /*global FB*/
    FB.init({
      appId: "759465309257916",
      cookie: true,
      version: "v16.0"
    });

    FB.getLoginStatus(function(response) {
      console.log(response);
      if (response.status === "connected") {
        handleFBCallbackResponse(response);
      }
    });
  }, []);

  const handleFacebookSignIn = () => {
    FB.login(function(response) {
      console.log(response);
      if (response.status === "connected") {
        handleFBCallbackResponse(response);
      }
    }, { scope: "email" });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    console.log(email, password)
  };

  return (
    <>
      <Form className="vh-100" style={myStyle} onSubmit={submitHandler}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card bg-dark text-white"
                style={{ borderRadius: '1rem' }}
              >
                <div className="card-body p-5 text-center">
                  <div className="mb-md-5 mt-md-4 pb-5">
                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                    <p className="text-white-50 mb-5">
                      Please enter your login and password!
                    </p>

                    <div className="form-outline form-white mb-4">
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                      />
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}

                      />
                    </div>

                    <p className="small mb-5 pb-lg-2">
                      <a href="#!" className="text-white-50">
                        Forgot password?
                      </a>
                    </p>
                    {error && (<Message variant="danger">{error}</Message>)}
                    {loading && <Loader />}
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Login
                    </button>

                    <div className="d-flex justify-content-center text-center mt-4 pt-1">
                      <div className='btn btn-dark' onClick={handleFacebookSignIn}>
                        <i className="fab fa-facebook-f fa-lg px-2"></i>
                      </div>
                        <TwitterLogin
                          authCallback={authHandler}
                          consumerKey='FOyTkyzQijlkbms48QhE5L45Z'
                          consumerSecret='j3QJXpirLXJ57ujs1gaAPFe6wEp9G4Xq7au0dezoGOqZX567Vg'
                          style={{display: 'none'}}
                        >
                      <div className='btn btn-dark' >
                        <i className="fab fa-twitter fa-lg px-2"/>
                      </div>
                      </TwitterLogin>
                      <div className='btn btn-dark ' onClick={handleGoogleSignIn}>
                        <i className="fab fa-google fa-lg px-2"></i>
                      </div >
                    </div>
                  </div>

                  <div>
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <a href="/register" className="text-white-50 fw-bold">
                        Sign Up
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>

      <div style={{ paddingBottom: '5rem' }}></div>
    </>
  );
};

export default LoginScreen;