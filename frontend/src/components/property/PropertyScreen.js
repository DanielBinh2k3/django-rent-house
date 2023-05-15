import React, { useState } from 'react';
import './propertyScreen.css';
import { FiShare } from 'react-icons/fi';
import {MdFavoriteBorder, MdFavorite} from 'react-icons/md';
import {AiFillStar} from 'react-icons/ai'
import {FacebookIcon, FacebookShareButton, TwitterShareButton, TwitterIcon, TelegramShareButton, TelegramIcon, WhatsappShareButton, WhatsappIcon} from 'react-share'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar, DateRange } from 'react-date-range';
import { format } from 'date-fns';


const PropertyScreen = () => {
  const newStartDate = new Date();
  const newEndDate = new Date();

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [isSelectionDone, setIsSelectionDone] = useState(false);
  const handleSelect = (ranges) => {
    // Set newStartDate and newEndDate to the current values of startDate and endDate
    const { startDate, endDate } = ranges.selection;
    const newStartDate = new Date(startDate.getTime());
    const newEndDate = new Date(endDate.getTime());

    setSelectionRange({ ...ranges.selection, key: 'selection' });
    setIsSelectionDone(true);
  };
  
    const buttonStyles = {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0px',
    font: 'inherit',
    color: 'inherit',
    cursor: 'pointer',
  };
  const elementStyles = {
    paddingTop: '48px',
    paddingBottom: '24px',
  }
  const horizontalLine = { 
    borderTop: '1px solid #ccc', 
    margin: '24px 0' 
  }

  return (
    <>
    <div className='container _2hs30c padding-property ' >
      {/* Title */}
        <div className="row">
            <div className="_b8stb0">
              <span className="_1n81at5">
                  <h3 tabindex="-1" className="hghzvl1 i1wofiac">Plan City Adventures from a Surry Hills </h3>
              </span>
            </div>
          <div className="w-100"></div>
            <div className="col-12 col-sm-6 col-md-8">
              <div className="_1qdp1ym">
                  <div className="_dm2bj1">
                      <span className="_1jvg42j ">
                        <span className="_12m9c11 "></span>
                      </span>
                      <span className="_17p6nbba" aria-hidden="true">4.92 ·</span>
                      <span className="_s65ijh7">595 reviews</span>
                      <span aria-hidden="true">·</span>
                      <span className="_s65ijh7">Address Temporary</span>
                  </div>
                </div>
            </div>
          <div className="col-6 col-md-3 row">
            <div className='col' style={{height: '10px'}}>
              <FacebookShareButton url='https://www.facebook.com/'>
                <FacebookIcon size={24} round={true} />
              </FacebookShareButton>
              <TwitterShareButton url='https://www.twitter.com/'>
                <TwitterIcon size={24} round={true} />
              </TwitterShareButton>
              <TelegramShareButton url='https://www.telegram.com/'>
                <TelegramIcon size={24} round={true} />
              </TelegramShareButton>
            </div>
            <div className='col-8'>
              <button style={buttonStyles}>
                  <MdFavoriteBorder/>
                  <span className="_s65ijh7">Favorite</span>
              </button>
            </div>
          </div>
        </div>
      {/* Image */}
      <div className='row padding-property'>
        <div className='col-md-6' style={{height: "27.5rem"}}>
          <img src='https://a0.muscache.com/im/pictures/miso/Hosting-23206143/original/e7da1f36-922f-4631-a287-91ceda05970f.jpeg?im_w=1200'></img>
        </div>
        <div className='col-md-6' style={{height: "28rem"}}>
          <div className='row'>
            <div className='col-6'><img src='https://a0.muscache.com/im/pictures/miso/Hosting-23206143/original/e7da1f36-922f-4631-a287-91ceda05970f.jpeg?im_w=1200'></img>
            </div> 
            <div className='col-6'><img src='https://a0.muscache.com/im/pictures/miso/Hosting-23206143/original/e7da1f36-922f-4631-a287-91ceda05970f.jpeg?im_w=1200'></img>
            </div> 
          </div>
          <div style={{paddingTop: '24px'}}></div>
          <div className='row'>
            <div className='col-6'><img src='https://a0.muscache.com/im/pictures/miso/Hosting-23206143/original/e7da1f36-922f-4631-a287-91ceda05970f.jpeg?im_w=1200'></img>
            </div> 
            <div className='col-6'><img src='https://a0.muscache.com/im/pictures/miso/Hosting-23206143/original/e7da1f36-922f-4631-a287-91ceda05970f.jpeg?im_w=1200'></img>
            </div> 
          </div>
        </div>
      </div>

    <div className='_gpz5gq'>
    {/* Main Content */}
    <div className='main-content' style={elementStyles} >

      {/* Infomation  */}
      <div className='row'>
        <div className='col-11'>
          <h3 
          tabindex="-1" 
          className="hghzvl1 i1wofiac "  
          style={{fontSize: '1.5rem', fontWeight: '500'}}>
          Room in a barn hosted by Michelle & Michael</h3>
        </div>
        <div className='col'>
        <img  
        className='rounded'
        src="https://lh3.googleusercontent.com/ogw/AOLn63FNpotQGl1xsukyIjPyqS5AkG9ThmkKO8b6xMpzPA=s32-c-mo"/>
        </div>
      </div>
      <div class="address"> Cô Giang, Phường 2, Quận Phú Nhuận, TPHCM</div>
      
      <div style={horizontalLine}></div>
    {/* Main Information */}
    <div class="info-attrs clearfix">
      <div class="info-attr clearfix">
          <span>Diện tích sử dụng</span>
          <span>40 m<sup>2</sup></span>
      </div>
      <div class="info-attr clearfix">
          <span>Phòng ngủ</span>
          <span>1</span>
      </div>
      <div class="info-attr clearfix">
          <span>Nhà tắm</span>
          <span>1</span>
      </div>
      <div class="info-attr clearfix">
          <span>Pháp lý</span>
          <span>Không xác định</span>
      </div>
      <div class="info-attr clearfix">
          <span>Ngày đăng</span>
          <span>10/05/2023</span>
      </div>
      <div class="info-attr clearfix">
          <span>Mã BĐS</span>
          <span>22148807</span>
      </div>
    </div>
    <div style={horizontalLine}></div>
    {/* Description */}
    <div className='info-title'>
      <h4>Description</h4>
    </div>
    <div class="info-content-body">
      🌈HỆ THỐNG CĂN HỘ DỊCH VỤ CAO CẤP NGAY TRUNG TÂM QUẬN 2 💥💥<br/>
      ƯU ĐÃI HỖ TRỢ 1TR KHI XEM PHÒNG VÀ CHỐT NGAY<br/><br/>
      Vị trí: nằm trên trục đường chính: <br/>
      🤟 Quận 2: Thảo Điền<br/><br/>
      📣 Hệ Thống Căn Hộ Dịch Vụ Khu Vực Bình Thạnh, Phú Nhuận, Quận 1, Quận 2 - Full Nội Thất<br/><br/>
      GIÁ ĐÃ BAO GỒM TẤT CẢ CÁC DỊCH VỤ, TIỆN ÍCH SAU:
      <br/>📣 Máy giặt, nơi phơi quần áo.
      <br/>📣 Bào trì, sữa chữa.
      <br/>📣 Chỗ để xe rộng rãi.
      <br/>📣 Cửa vân tay an ninh
      <br/>📣 Camera 24/24 (Khu nhà xe và những khu vực chung).
      <br/>📣 Dọn vệ sinh hàng tuần (khu vực chung) và thu gom rác hàng ngày.
      <br/>📣 Giờ giấc tự do, không chung chủ
      <br/>📣 Full nội thất cao cấp
      <br/>📣 Phù hợp với các bạn sinh viên , học sinh hay các bạn đã đi làm , gia đình , những ai muốn có một không gian thoải mái, đầy đủ tiện nghi và ngôi nhà nghỉ ngơi sau 1 ngày dài làm việc mệt mỏi , ở lâu dài<br/><br/>✅ MQ Luxury Apartment ✅ chuyên tất cả các loại căn hộ :<br/>✌️ Studio : 5 - 12triệu<br/>✌️ 1 Phòng Ngủ : từ 8 - 15triệu<br/>✌️ 2 Phòng ngủ : chỉ từ 13 triệu
    </div>
    <div style={horizontalLine}></div>
    {/* Banner Rent Cover */}
    <div>
      <section>
        <div class="cnlfh1x dir dir-ltr">
            <h2 tabindex="-1" class="hghzvl1 dir dir-ltr" elementtiming="LCP-target"><img class="l1li2ovm dir dir-ltr" src="https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg" alt="AirCover"/></h2>
            <div class="tgbzqhs dir dir-ltr">Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking&nbsp;in.</div>
            <span aria-label="Learn more" className="_s65ijh7">Learn more</span>
        </div>
      </section>
    </div>
    <div style={horizontalLine}></div>

    {/* Where You'll Sleep */}
    <div>
      <div className='info-title'>
        <h4>Where you'll sleep</h4>
      </div>
      <div className='col-6 rounded'>
        <img src='https://a0.muscache.com/im/pictures/miso/Hosting-23206143/original/e7da1f36-922f-4631-a287-91ceda05970f.jpeg?im_w=1200'></img>
      </div>
    </div>
    <div style={horizontalLine}></div>
    </div>
    {/* SideBar for order */}
    <div className='sidebar-order padding-property' >
      <div className="card shadow" style={{width: '24rem', padding: '0px 20px'}} >
        <div className="card-body">
          <h5 className="card-title row">
            <div className="price-info col-md-8">350$<span className='_s65ijh7'>month</span></div>
            <div className='col-md-4' style={{scale: '0.8'}}> <AiFillStar/>4.9</div>
          </h5>
        <div className='text-center'>
        {!isSelectionDone ? (
          <DateRange
            ranges={[selectionRange]}
            onChange={handleSelect}
          />
        ) : (
        <div className="selected-range" 
        onClick={() => {
          setIsSelectionDone(!isSelectionDone); 
          setSelectionRange({
            startDate: newStartDate,
            endDate: newEndDate,
            key: 'selection',
          });}}>
          <div className="date-range-box v-100">
            <span className="start-date">{format(selectionRange.startDate, 'dd MMM yyyy')}</span>
            <span className="separator">-</span>
            <span className="end-date">{format(selectionRange.endDate, 'dd MMM yyyy')}</span>
          </div>
        </div>
        )}
          <a href="#" className="col-9 btn btn-block btn-dark" style={{marginTop: '24px'}}>Go somewhere</a>
          <p style={{paddingTop: '6px'}}>You won't be charge yet</p>
        </div>
        <div>
          {/* Money price estimate */}
          <div className='row p-1'>
            <span className='col-md-9 _s65ijh7' style={{fontWeight: '100'}}>Money Price x Month</span> 
            <span className='col-md-3'>$1000</span>
          </div>
          {/* Other fee */}
          <div className='row p-1'>
            <span className='col-md-9 _s65ijh7' style={{fontWeight: '100'}}>Other Fee</span> 
            <span className='col-md-3'>$100</span>
          </div>
          {/* Service fee  */}
          <div className='row p-1'>
            <span className='col-md-9 _s65ijh7' style={{fontWeight: '100'}}>App fee</span> 
            <span className='col-md-3'>$10</span>
          </div>
        </div>
        <div style={horizontalLine}></div>
        <div className='row'>
          <div className='col-md-9'><h5><b>Total Price</b></h5>(without tax)</div>
          <div className='col-md-3'><b>$1000</b></div>
        </div>



        </div>
      </div>
    </div>
  </div>
    {/* Where You'll be*/}
    <div>
      <div className='info-title'>
        <h4>Where you'll sleep</h4>
      </div>
        <img src='./images/map.png'></img>
    </div>
    <div style={horizontalLine}></div>
    {/* Things To Know */}
    </div>
    </>
  )
}

export default PropertyScreen