import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { FaAddressCard, FaBell, FaHeart, FaSignOutAlt, FaUnlockAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { getPublicListings } from '../../apiRequest/actions/listingActions'

const FavoriteScreen = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;
  const dispatch = useDispatch();

  const listingList = useSelector((state) => state.listingList);
  const properties = listingList.listings.results;

  useEffect(() => {
    dispatch(getPublicListings());
    console.log(favoritePropertiesList)
    console.log(properties)
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
  };

  // Retrieve favorite property IDs from local storage
  const favoriteProperties = localStorage.getItem('favoriteProperties');
  const favoritePropertyIds = favoriteProperties ? JSON.parse(favoriteProperties) : [];

  // Filter properties to include only the favorite properties
  const favoritePropertiesList = properties ? properties.filter((property) =>
    favoritePropertyIds.includes(property.id)
  ): [];

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
                    <li>
                    <a href="/profile/notification" rel="nofollow">
                        <FaBell /> Notification &amp; Search
                    </a>
                    </li>
                    <li className="active">
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
              <div className="property-commands">
        {/* Search form */}
        <ul className="clearfix">
          <li className="search">
            <div onSubmit={handleSearch} >
              <input type="text" placeholder="Mã tin" />
              <button type="submit" className="btn-mogi-2">
                <i className="fa fa-search"></i>Search
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div className="property-list">
        {/* Property items */}
        {properties && favoritePropertiesList.map((property) => (
          <div className="property clearfix" key={property.id}>
            <div className="property-media">
              <img src={property.main_photo} alt="main photo" />
            </div>
            <div className="property-info row">
              <a href={`/${property.slug}`} className="property-title">
                {property.title}
              </a>
              <ul className="property-info-list clearfix col-md-10">
                <li><div className="property-price-1">{property.price}$</div></li>
                <li className="spliter"><span>|</span></li>
                <li><div className="property-id">Property ID: {property.id}</div></li>
                <li className="spliter"><span>|</span></li>
                <li><div className="property-view-count ">Views Count: {property.view_counts}</div></li>
              </ul>
            </div>

          </div>
        ))}
      </div>
          <div className="row">
            <div className="col-sm-12 text-center">
              {/* <!-- ngIf: UserMessage.Total >10 --> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FavoriteScreen