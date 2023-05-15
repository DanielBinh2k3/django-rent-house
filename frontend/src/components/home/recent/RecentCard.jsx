import React, { useEffect } from "react"
import { list } from "../../data/Data"
import { useDispatch, useSelector } from 'react-redux'
import { getPublicListings } from "../../../apiRequest/actions/listingActions"

const RecentCard = () => {
  const dispatch = useDispatch()
  const listingList = useSelector(state => state.listingList)
  const {error, loading ,listings} =listingList
  useEffect (() => {
    dispatch(getPublicListings())
  }, [])
    return (
    <div className='content grid3 mtop'>
      {listings && listings.map(listing => (
        <div className='box shadow' key={listing.id}>
          <div className='img'>
            <img src={listing.main_photo} alt=''  style={{height: '16rem'}}/>
          </div>
          <div className='text'>
            <div className='category flex'>
              <span style={{ background: listing.home_type === "For Sale" ? "#25b5791a" : "#ff98001a", color: listing.home_type === "For Sale" ? "#25b579" : "#ff9800" }}>{listing.home_type}</span>
              <i className='fa fa-heart'></i>
            </div>
            <h4>{listing.name}</h4>
            <p>
              <i className='fa fa-location-dot'></i> {listing.address}
            </p>
          </div>
          <div className='button flex'>
            <div>
              <button className='btn2'>{listing.price}</button> <label htmlFor=''>/sqft</label>
            </div>
            <span>{'Renting'}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentCard