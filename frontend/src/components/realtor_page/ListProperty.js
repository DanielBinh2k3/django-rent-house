import React, { useEffect, useState } from "react";
import "./listproperty.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import EditPropertyScreen from "./EditPropertyScreen";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteListing,
	getPublicListings,
} from "../../apiRequest/actions/listingActions";
import Loader from "../common/Loader";
import Message1 from "../common/Message1";

function PropertyList() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [showModal, setShowModal] = useState({});
	const listingList = useSelector((state) => state.listingList);
	const { error, loading, listings: properties } = listingList;
	const userInfo = localStorage.getItem("userInfo");

	useEffect(() => {
		if (!userInfo) {
			navigate("/login");
		}
		dispatch(getPublicListings());
	}, [dispatch]);

	const handleEditClick = (propertyId) => {
		setShowModal((prevShowModal) => ({
			...prevShowModal,
			[propertyId]: true,
		}));
	};

	const handleClose = (propertyId) => {
		setShowModal((prevShowModal) => ({
			...prevShowModal,
			[propertyId]: false,
		}));
	};

	const handleSearch = (e) => {
		e.preventDefault();

		// Logic for handling search
	};

	const deleteHandler = (id) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			// Delete product
			dispatch(deleteListing(id));
		}
	};

	return (
		<>
			{loading && <Loader />}
			{error && <Message1 variant="danger">{error}</Message1>}
			<div id="main-listproperty" className="mg-container card">
				<div className="property-tabs">
					{/* Tab buttons */}
					<ul className="noselect clearfix">
						<li onClick={() => {}}>
							Approved<span>(0)</span>
						</li>
						<li onClick={() => {}}>
							Error post<span>(0)</span>
						</li>
						<li className="active" onClick={() => {}}>
							Others<span>({properties.count})</span>
						</li>
						<li className="offset-md-1">
							<a href="add-property" className="btn btn-primary btn-block">
								Add Property
							</a>
						</li>
					</ul>
				</div>

				<div className="property-commands">
					{/* Search form */}
					<ul className="clearfix">
						<li className="search">
							<form onSubmit={handleSearch} style={{ marginTop: "10px" }}>
								<select>
									<option value="">Select Type</option>
									<option value="House">House</option>
									<option value="Condo">Condo</option>
									<option value="Townhouse">Townhouse</option>
								</select>

								<select>
									<option value="">Select City</option>
								</select>
								<select>
									<option value="">Select Price</option>
									<option value="0-300">0 - 300</option>
									<option value="300-700">300 - 700</option>
									<option value="700-1000">700 - 1000</option>
									<option value=">1000"> {">"} 1000</option>
								</select>
								<select>
									<option value="">Is Available</option>
									<option value="true">True</option>
									<option value="false">False</option>
								</select>
								<select>
									<option value="">Is Publish</option>
									<option value="true">True</option>
									<option value="false">False</option>
								</select>

								<input type="text" placeholder="Text Search" />

								<button type="submit" className="btn-mogi-2">
									<i className="fa fa-search"></i>
								</button>
							</form>
						</li>
					</ul>
				</div>
				<div className="property-list">
					{/* Property items */}
					{properties &&
						properties.results &&
						properties.results.map((property) => (
							<div className="property clearfix" key={property.id}>
								<div className="property-media">
									<img src={property.main_photo} alt="main photo" />
								</div>
								<div className="property-info row">
									<a
										href={`https://mogi.vn/quan-bac-tu-liem/can-ho-penthouse/ban-nha-dat-id${property.propertyId}`}
										className="property-title">
										{property.title}
									</a>
									<ul className="property-info-list clearfix col-md-10">
										<li>
											<div className="property-price-1">{property.price}$</div>
										</li>
										<li className="spliter">
											<span>|</span>
										</li>
										<li>
											<div className="property-id">
												Property ID: {property.id}
											</div>
										</li>
										<li className="spliter">
											<span>|</span>
										</li>
										<li>
											<div className="property-view-count">
												Views Count: {property.view_counts}
											</div>
										</li>
									</ul>
									<Button
										variant="light"
										className="btn-sm col-md-1"
										onClick={() => handleEditClick(property.id)}>
										<i className="fas fa-edit"></i>
									</Button>
									<Button
										variant="danger"
										className="btn-sm col-md-1"
										onClick={() => deleteHandler(property.id)}>
										<i className="fas fa-trash"></i>
									</Button>
								</div>
								{showModal[property.id] && (
									<EditPropertyScreen
										pk={property.id}
										showModal={showModal[property.id]}
										handleClose={() => handleClose(property.id)}
									/>
								)}
							</div>
						))}
				</div>
			</div>
		</>
	);
}

export default PropertyList;
