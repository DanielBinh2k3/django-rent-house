import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import Message1 from "../common/Message1";
import { isFavorite, toggleFavorites } from "../favorite/FavoriteFunc";
import Hero from "./hero/Hero";
import "./recent/recent.css";

const SearchScreen = () => {
	const navigate = useNavigate();
	const listingSearch = useSelector((state) => state.listingSearch);
	const { error, loading, listings } = listingSearch;
	var storedFavorites = JSON.parse(localStorage.getItem("favoriteProperties"));

	useEffect(() => {
		console.log(error, loading, listings);
		if (listings && listings.results) {
			console.log(listings.results);
		}
	}, [error, loading, listings, navigate]);

	return (
		<>
			<Hero />

			<div className="container padding">
				<h1>Search Result</h1>
				{loading ? (
					<Loader />
				) : error ? (
					<Message1 variant="danger">{error}</Message1>
				) : (
					<div className="content grid3 mtop">
						{listings &&
							listings.map((listing) => (
								<div className="box shadow" key={listing.id}>
									<div
										className="img"
										onClick={() => navigate(`${listing.slug}`)}>
										<img
											src={listing.main_photo}
											alt=""
											style={{ height: "16rem" }}
										/>
									</div>

									<div className="text">
										<div className="category flex">
											<span
												style={{
													background:
														listing.home_type === "For Sale"
															? "#25b5791a"
															: "#ff98001a",
													color:
														listing.home_type === "For Sale"
															? "#25b579"
															: "#ff9800",
												}}>
												{listing.home_type}
											</span>
											<div
												onClick={() => {
													toggleFavorites(listing.id);
												}}>
												<i
													className="fa fa-heart"
													style={{
														color: isFavorite(listing.id) ? "red" : "none",
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
			</div>
		</>
	);
};

export default SearchScreen;
