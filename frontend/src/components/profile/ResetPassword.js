import React, { useEffect, useState } from 'react';
import { FaBell, FaHeart, FaAddressCard, FaUnlockAlt, FaSignOutAlt } from 'react-icons/fa';
import './profilescreen.css';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordUser } from '../../apiRequest/actions/userActions';
import { useNavigate } from 'react-router-dom';
import Message1 from '../common/Message1';
const ResetPassword = () => {
  const userLogin = useSelector(state=> state.userLogin)
  const {error, loading, userInfo} = userLogin
  const userResetPassword = useSelector(state=> state.userResetPassword)
  const { successResetPassword, error: errorResetPassword, loading: loadingResetPassword, user: userResetPass} = userResetPassword
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('old_password', oldPassword);
    formData.append('new_password', newPassword);
    formData.append('confirm_password', confirmPassword);

    dispatch(resetPasswordUser(formData));
  };
  useEffect(() => {
    if (successResetPassword){
      navigate('/profile')
    }
  }, [navigate])
  return (
    <>
      <div id="profile" className="mg-container" style={{marginBottom: '4rem'}}>
        <div id="sidebar" className="clearfix">
          <div className="col-md-3">
            <div className="profile-sidebar">
              {/* <!-- SIDEBAR USERPIC --> */}
              <div className="profile-userinfo clearfix line">
                <div className="profile-userpic">
                {true ?
                  <img
                    className="img-responsive"
                    src={userInfo.image_profile}
                    alt={"profile of " + userInfo.name} 
                  /> :
                  <img
                    className="img-responsive ng-hide"
                    src="./no-avatar.jpg"
                    alt="no avatar"
                  />}
                </div>
                {/* <!-- END SIDEBAR USERPIC -->
                <!-- SIDEBAR USER TITLE --> */}
                <div className="profile-usertitle">
                  <div className="profile-usertitle-name">
                    {userInfo.name}
                  </div>
                  <div className="profile-usertitle-job">{userInfo.contact || 'Not have contact yet'}</div>
                </div>
                {/* <!-- END SIDEBAR USER TITLE -->
                <!-- SIDEBAR MENU --> */}
              </div>
             <div className="profile-usermenu clearfix">
                <ul className="nav navbar-nav">
                    <li className="">
                    <a href="/profile/notification" rel="nofollow">
                        <FaBell /> Notification &amp; Search
                    </a>
                    </li>
                    <li className="">
                    <a href="/profile/favorite" rel="nofollow">
                        <FaHeart /> Favourite Property
                    </a>
                    </li>
                    <li className="">
                    <a href="/profile/personal-infomation" rel="nofollow">
                        <FaAddressCard /> Personal Infomation
                    </a>
                    </li>
                    <li className="active">
                    <a href="/profile/reset-password" rel="nofollow">
                        <FaUnlockAlt /> Reset Password
                    </a>
                    </li>
                    <li>
                    <a href="/logoff">
                        <FaSignOutAlt className="f18" /> Log Out
                    </a>
                    </li>
                </ul>
            </div>  
              {/* <!-- END MENU --> */}
            </div>
          </div>
        </div>
        <div id="main" className="">
            <div className="profile-content changepass clearfix">
            <form className="form-horizontal" onSubmit={handleSubmit}>
                <div className="col-sm-12">
                <div>
                    <label className="titlename">Recent Password</label>
                    <input
                    className="text-control"
                    type="password"
                    name="OldPassWord"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Recent Password"
                    required
                    />
                </div>
                <div className="msg-error">
                    {/* TODO: display error message */}
                </div>
                </div>
                <div className="col-sm-12">
                <div>
                    <label className="titlename">New Password</label>
                    <input
                    className="text-control"
                    type="password"
                    name="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    pattern="^[A-Za-z0-9!@#$%^&amp;*]{6,50}$"
                    required
                    />
                </div>
                <div className="msg-error">
                    {/* TODO: display error message */}
                </div>
                </div>
                <div className="col-sm-12">
                <div>
                    <label className="titlename">Re Password</label>
                    <input
                    className="text-control"
                    type="password"
                    name="ConfirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re Password"
                    required
                    />
                </div>
                <div className="msg-error">
                    {/* TODO: display error message */}
                </div>
                </div>
                <div className="col-sm-12">
                <div className="f-footer">
                    <button className="btn btn-success btn-block left-170" onClick={handleSubmit}>
                    Update
                    </button>
                </div>
                </div>
            </form>
            </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword