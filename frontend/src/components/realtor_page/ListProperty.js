import React, { useEffect, useState } from 'react';
import './listproperty.css'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import EditPropertyScreen from './EditPropertyScreen';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicListings } from '../../apiRequest/actions/listingActions';


function PropertyList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const listingList = useSelector((state) => state.listingList);
  const { error, loading, listings: properties } = listingList;

  useEffect(() => {
    dispatch(getPublicListings());
  }, [dispatch]);

  const handleEditClick = () => {
    setShowModal(true);
  }

  const handleClose = () => {
    setShowModal(false);
  }

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
          <li onClick={() => {}}>Approved<span>(0)</span></li>
          <li onClick={() => {}}>Error post<span>(0)</span></li>
          <li className="active" onClick={() => {}}>Others<span>({properties.count})</span></li>
          <li className='offset-md-2'><a href='add-property' className='btn btn-primary btn-block'>Add Property</a></li>
        </ul>
      </div>
      
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
        {properties && properties.results && properties.results.map((property) => (
          <div className="property clearfix" key={property.id}>
            <div className="property-media">
              <img src={property.main_photo} alt="main photo" />
            </div>
            <div className="property-info row">
              <a href={`https://mogi.vn/quan-bac-tu-liem/can-ho-penthouse/ban-nha-dat-id${property.propertyId}`} className="property-title">
                {property.title}
              </a>
              <ul className="property-info-list clearfix col-md-10">
                <li><div className="property-price-1">{property.price}$</div></li>
                <li className="spliter"><span>|</span></li>
                <li><div className="property-id">Property ID: {property.id}</div></li>
                <li className="spliter"><span>|</span></li>
                <li><div className="property-view-count ">Views Count: {property.view_counts}</div></li>
              </ul>
              <Button variant='light' className='btn-sm col-md-1' onClick={handleEditClick}>
                <i className='fas fa-edit'></i>
              </Button>
              <Button variant='danger' className='btn-sm col-md-1' onClick={() => deleteHandler(property.id)}>
                <i className='fas fa-trash'></i>
              </Button>
            </div>
            {showModal && <EditPropertyScreen pk={property.id} showModal={showModal} handleClose={handleClose} />}
          </div>
        ))}
      </div>

    </div>

</>
  );
}

export default PropertyList;

