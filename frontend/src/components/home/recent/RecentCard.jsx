import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPublicListings } from "../../../apiRequest/actions/listingActions";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import Message1 from "../../common/Message1";
import { toggleFavorites } from "../../favorite/FavoriteFunc";


const RecentCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listingList = useSelector((state) => state.listingList);
  const { error, loading, listings } = listingList;
  var storedFavorites = JSON.parse(localStorage.getItem("favoriteProperties"))

  useEffect(() => {
    dispatch(getPublicListings());
  }, [dispatch]);
  useEffect(() => {
    console.log(error, loading, listings);
    if (listings && listings.results) {
      console.log(listings.results);
    }

  }, [error, loading, listings, navigate]);
  const isFavorite = (listingId) => {
    // Check if favorites exist in local storage
    let storedFavorites = JSON.parse(localStorage.getItem("favoriteProperties"));

    // If favorites don't exist, create an empty array
    if (!storedFavorites) {
      storedFavorites = [];
      localStorage.setItem("favoriteProperties", JSON.stringify(storedFavorites));
    }

    // Check if the listingId exists in the favorites list
    return storedFavorites.includes(listingId);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message1 variant="danger">{error}</Message1>
      ) : (
        <div className="content grid3 mtop">
          {listings &&
            listings.results &&
            listings.results.map((listing) => (
              <div className="box shadow" key={listing.id}>
                
                  <div className="img" onClick={() => navigate(`${listing.slug}`)}>
                    <img src={listing.main_photo} alt="" style={{ height: "16rem" }} />
                  </div>
                

                <div className="text">
                  <div className="category flex">
                    <span
                      style={{
                        background: listing.home_type === "For Sale" ? "#25b5791a" : "#ff98001a",
                        color: listing.home_type === "For Sale" ? "#25b579" : "#ff9800",
                      }}
                    >
                      {listing.home_type}
                    </span>
                    <div onClick={() => {toggleFavorites(listing.id)}}>
                      <i className="fa fa-heart"style={{color: isFavorite(listing.id) ? "red" : "none",
                        }}></i>
                    </div>
                  </div>
                  <h7>{listing.title}</h7>
                  <p>
                    <i className="fa fa-location-dot"></i> {listing.address}
                  </p>
                </div>
                <div className="button flex">
                  <div>
                    <button className="btn2">{listing.price}</button>{" "}
                    <label htmlFor="">/sqft</label>
                  </div>
                  <span>{listing.listing_type}</span>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default RecentCard;
