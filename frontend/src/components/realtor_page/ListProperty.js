import React, { useState } from 'react';
import './listproperty.css'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import EditPropertyScreen from './EditPropertyScreen';


function PropertyList() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);

  const handleEditClick = () => {
    setShowModal(true);
  }

  const handleClose = () => {
    setShowModal(false);
  }
  const [properties, setProperties] = useState([
    {
      id: 1,
      image: 'https://cloud.mogi.vn/images/thumb-small/2023/05/18/510/dc499c9b5c444923ba2c92b891cf9ed6.jpg',
      title: 'sadfljklasjdfdafadslkfjdsaklfjsdlakjfklsajklsfajd',
      price: '123 triệu',
      propertyId: 22163353,
      viewCount: 0,
      created: '18/05/2023'
    },
    {
      id: 2,
      image: 'https://cloud.mogi.vn/images/thumb-small/2023/05/03/557/c22d1b5ae6154cefaed70d468937cf58.jpg',
      title: 'asdjkflasdjflajsd;klfja;dlsjfkl ;asjasdkl;jflk ;asjflk;jasd l;kjadfslk',
      price: '1 triệu 234 nghìn',
      propertyId: 22143687,
      viewCount: 0,
      created: '04/05/2023'
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    
  };

  const deleteHandler = (id) => {
      if(window.confirm("Are you sure you want to delete this product?")){
          //Delete products
          // dispatch(deleteProduct(id))
      }
  }

  return (
    <>
    <div id="main-listproperty" className='mg-container card'>
      <div className="property-tabs">
        {/* Tab buttons */}
        <ul className="noselect clearfix">
          <li onClick={() => {}}>Đang đăng <span>(0)</span></li>
          <li onClick={() => {}}>Tin lỗi <span>(0)</span></li>
          <li className="active" onClick={() => {}}>Tin khác <span>(2)</span></li>
        </ul>
      </div>
      <div className="property-commands">
        {/* Search form */}
        <ul className="clearfix">
          <li>
            <div className="property-selected-all mg-check ng-hide">
              <i className="fa fa-check"></i>
            </div>
          </li>
          <li className="search">
            <div onSubmit={handleSearch} >
              <input type="text" placeholder="Mã tin" />
              <button type="submit" className="btn-mogi-2">
                <i className="fa fa-search"></i>Tìm kiếm
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div className="property-list">
        {/* Property items */}
        {properties.map((property) => (
          <div className="property clearfix" key={property.id}>
            <div className="property-media">
              <img src={property.image} alt="" />
            </div>
            <div className="property-info row">
              <a href={`https://mogi.vn/quan-bac-tu-liem/can-ho-penthouse/ban-nha-dat-id${property.propertyId}`} className="property-title">
                {property.title}
              </a>
              <ul className="property-info-list clearfix col-md-10">
                <li><div className="property-price-1">123 triệu</div></li>
                <li className="spliter"><span>|</span></li>
                <li><div className="property-id">Mã tin: 22163353</div></li>
                <li className="spliter"><span>|</span></li>
                <li><div className="property-view-count ">Lượt xem: 0</div></li>
              </ul>
              <Button variant='light' className='btn-sm col-md-1' onClick={handleEditClick}>
                <i className='fas fa-edit'></i>
              </Button>
              <Button variant='danger' className='btn-sm col-md-1' onClick={() => deleteHandler(product._id)}>
                <i className='fas fa-trash'></i>
              </Button>
            </div>
            {showModal && <EditPropertyScreen showModal={showModal} handleClose={handleClose} />}
          </div>
        ))}
      </div>

    </div>

</>
  );
}

export default PropertyList;

