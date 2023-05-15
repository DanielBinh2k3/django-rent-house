import React from 'react';
import { FaBell, FaHeart, FaAddressCard, FaUnlockAlt, FaSignOutAlt } from 'react-icons/fa';
import './profilescreen.css';

const ProfileScreen = () => {
  return (
    <>
      <div id="profile" className="mg-container" style={{marginBottom: '4rem'}}>
        <div id="sidebar" className="clearfix">
          <div className="col-md-3">
            <div className="profile-sidebar">
              {/* <!-- SIDEBAR USERPIC --> */}
              <div className="profile-userinfo clearfix line">
                <div className="profile-userpic">
                {false ?
                  <img
                    className="img-responsive"
                    src="/content/images/avatar.png"
                    alt="profile"
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
                    Truong Gia Binh
                  </div>
                  <div className="profile-usertitle-job">0585783526</div>
                </div>
                {/* <!-- END SIDEBAR USER TITLE -->
                <!-- SIDEBAR MENU --> */}
              </div>
             <div className="profile-usermenu clearfix">
                <ul className="nav navbar-nav">
                    <li className="active">
                    <a href="/trang-ca-nhan/tim-kiem-da-luu" rel="nofollow">
                        <FaBell /> Thông báo &amp; Tìm kiếm
                    </a>
                    </li>
                    <li className="">
                    <a href="/trang-ca-nhan/bat-dong-san-yeu-thich" rel="nofollow">
                        <FaHeart /> Bất động sản yêu thích
                    </a>
                    </li>
                    <li className="">
                    <a href="/trang-ca-nhan/thong-tin-ca-nhan" rel="nofollow">
                        <FaAddressCard /> Thông tin cá nhân
                    </a>
                    </li>
                    <li className="">
                    <a href="/trang-ca-nhan/doi-mat-khau" rel="nofollow">
                        <FaUnlockAlt /> Thay đổi mật khẩu
                    </a>
                    </li>
                    <li>
                    <a href="/logoff">
                        <FaSignOutAlt className="f18" /> Thoát
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