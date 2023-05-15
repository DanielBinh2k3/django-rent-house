import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../common/Message1';
import Loader from '../common/Loader';
import { login } from '../../apiRequest/actions/userActions';
import { Form } from 'react-bootstrap';


const LoginScreen = () => {
  const myStyle = {
    /* fallback for old browsers */
    background: '#6a11cb',

    /* Chrome 10-25, Safari 5.1-6 */
    background:
      '-webkit-linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))',

    scale: '0.85',
  };
  const responseGoogle = (response) => {
    console.log(response);
    // handle the response here
  }
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
                      <a href="#!" className="text-white">
                        <i className="fab fa-facebook-f fa-lg"></i>
                      </a>
                      <a
                        href="#!"
                        className="text-white"
                      >
                        <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                      </a>
                      <a href="#!" className="text-white">
                        <i className="fab fa-google fa-lg"></i>
                      </a>
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
