import React, { useState } from 'react';
import { FaBell, FaHeart, FaAddressCard, FaUnlockAlt, FaSignOutAlt } from 'react-icons/fa';
import './info-profile.css';
import { useSelector } from 'react-redux';

const InformationProfileScreen = () => {
  const userLogin = useSelector(state => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const [formData, setFormData] = useState({
    name: userInfo.name || '',
    email: userInfo.email || '',
    new_email: '',
    city: userInfo.city || null,
    district: userInfo.district || null,
    user_type: userInfo.isRealtor ? 'Realtor User' : 'Normal User',
    introduction: userInfo.introduction || ''
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    // handle form submission here
  };

  return (
    <>
      <div id="profile" className="mg-container" style={{ marginBottom: '4rem' }}>
        <div id="sidebar" className="clearfix">
          <div className="col-md-3">
            <div className="profile-sidebar">
              {/* <!-- SIDEBAR USERPIC --> */}
              <div className="profile-userinfo clearfix line">
                <div className="profile-userpic">
                  {true ? (
                    <img
                      className="img-responsive"
                      src={userInfo.image_profile}
                      alt={'profile of ' + userInfo.name}
                    />
                  ) : (
                    <img className="img-responsive ng-hide" src="./no-avatar.jpg" alt="no avatar" />
                  )}
                </div>
                {/* <!-- END SIDEBAR USERPIC -->
                <!-- SIDEBAR USER TITLE --> */}
                <div className="profile-usertitle">
                  <div className="profile-usertitle-name">{userInfo.name}</div>
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
                  <li className="active">
                    <a href="/profile/personal-infomation" rel="nofollow">
                      <FaAddressCard /> Personal Infomation
                    </a>
                  </li>
                  <li className="">
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
          <form onSubmit={handleSubmit} style={{ marginTop: '0px' }}>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} maxLength={255} />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} maxLength={255} disabled />
            </div>
            <div className="row">
              <div className="form-group col">
                <label>City/State:</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} maxLength={255} />
              </div>
              <div className="form-group col">
                <label>District:</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} maxLength={255} />
              </div>
            </div>

            <div className="form-group">
              <label>Type of User:</label>
              <input
                type="text"
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                maxLength={255}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                rows="3"
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                style={{ border: '1px solid rgba(128, 128, 128, 0.2)', padding: '5px', borderRadius: '5px' }}
              />
            </div>
            <button type="submit">Update</button>
          </form>
          <div className="row">
            <div className="col-sm-12 text-center">
              {/* <!-- ngIf: UserMessage.Total >10 --> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InformationProfileScreen;