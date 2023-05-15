import React from 'react';
import { FaBell, FaHeart, FaAddressCard, FaUnlockAlt, FaSignOutAlt } from 'react-icons/fa';
import './profilescreen.css';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {
    const userLogin = useSelector(state=> state.userLogin)
    const {error, loading, userInfo} = userLogin
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
                    <li className="active">
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
        <div id="main" className="" >
          <h2>Tìm kiếm đã lưu</h2>
          <div className="row-content clearfix">
            <div className="summary clearfix line">
              <div className="summary-tab active">
                <h4>
                  <a data-toggle="pill" href="#buy-list">
                    Mua <span className="counter">(0)</span>
                  </a>
                </h4>
              </div>
              <div className="summary-tab">
                <h4>
                  <a data-toggle="pill" href="#rent-list">
                    Thuê <span className="counter"> (0)</span>
                  </a>
                </h4>
              </div>
            </div>
            {/* <!-- ngRepeat: item in Search.Data --> */}
          </div>
          <div className="row" style={{ marginTop: '-50px', paddingTop: '50px' }}>
            <div className="col-sm-12">
              <a href="#message" id="message" aria-label="message">
                <h2 style={{ paddingTop: '60px', marginTop: '-60px' }}>
                  Danh sách thông báo
                </h2>
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <ul className="inbox">
                {/* <!-- ngRepeat: item in UserMessage.Messages --> */}
                <li className="message">
                  <a className="m-link" href="https://blog.mogi.vn/dang-tin-tha-ga/">
                    <p className="m-content">Chỉ 200K đăng tin không giới hạn cả mogi.vn và muaban.net</p>
                    <div className="m-send-date">28/06/2018</div>
                  </a>
                </li>
                {/* <!-- end ngRepeat: item in UserMessage.Messages --> */}
                <li className="message">
                  <a className="m-link" href="https://blog.mogi.vn/dang-tin-tha-ga/">
                    <p className="m-content">Chỉ 200K đăng tin thả ga toàn thành phố.</p>
                    <div className="m-send-date">11/06/2018</div>
                  </a>
                </li>
                {/* <!-- end ngRepeat: item in UserMessage.Messages --> */}
              </ul>
            </div>
          </div>
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

export default ProfileScreen;