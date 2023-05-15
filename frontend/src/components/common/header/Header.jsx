import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../apiRequest/actions/userActions";

const Header = () => {
  const [navList, setNavList] = useState(false);
  const [profileList, setProfileList] = useState(false);
  const [profileInfoList, setProfileInfoList] = useState(false);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const logOutHandle = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logout());
    }
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("dropdown-profile-info") &&
        !event.target.classList.contains("dropdown-list")
      ) {
        setProfileList(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);


const onImageMouseMove = (e) => {
  if(profileList){setProfileInfoList(false)}
  e.currentTarget.style.filter = "brightness(80%)";
  const profileInfo = document.getElementById("profile-info");
  profileInfo.style.display = "block";
};

const onImageMouseLeave = (e) => {
  e.currentTarget.style.filter = "brightness(100%)";
  const profileInfo = document.getElementById("profile-info");
  profileInfo.style.display = "none";
};

  return (
    <>
      <header>
        <div className="container flex">
          <div className="logo">
            <img src="./images/logo.png" alt="" />
          </div>
          <div className="nav">
            <ul className={navList ? "small" : "flex"}>
              {nav.map((list, index) => (
                <li key={index}>
                  <Link to={list.path}>{list.text}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="button flex">
            <h4>
              <span>2</span> My List
            </h4>
            {userInfo ? (
                <div
                  className="nav-item dropdown"
                  onMouseMove={() => setProfileInfoList(true)}
                  onMouseLeave={() => setProfileInfoList(false)}
                  onClick={() => {setProfileList(!profileList)} }
                  ref={dropdownRef}
                >
                  <img
                    className="gb_j gbii"
                    src="https://lh3.googleusercontent.com/ogw/AOLn63FNpotQGl1xsukyIjPyqS5AkG9ThmkKO8b6xMpzPA=s32-c-mo"
                    alt="My Profile"
                    onMouseMove={onImageMouseMove}
                    onMouseLeave={onImageMouseLeave}
                  />
                  {!profileList && 
                  <div id="profile-info" className="dropdown-profile-info" style={{padding: '5px 15px'}}>
                      <div className="text-center"><span>RentUp Info</span></div>
                      <div>{userInfo.username}</div>
                      <div>{userInfo.email}</div>
                      <div>{userInfo.isRealtor ? "Realtor" : "Normal"} User</div>
                  </div>}
                  
                  <div className={`dropdown-menu ${profileList ? "show" : ""}`} >
                    <ul className="dropdown-list">
                      <li>
                        <div >Profile</div>
                      </li>
                      <li>
                        <div onClick={logOutHandle}>
                          Sign Out
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
            ) : (
              <Link to="/login">
                <button className="btn1">
                  <i className="fa fa-sign-out"></i> Sign In
                </button>
              </Link>
            )}
          </div>
          <div className="toggle">
            <button onClick={() => setNavList(!navList)}>
              {navList ? <i className="fa fa-times"></i> : <i className="fa fa-bars"></i>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
