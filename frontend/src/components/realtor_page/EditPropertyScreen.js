import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import FormContainer from "../common/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import axios, { formToJSON } from "axios";
import {
	createListing,
	getListingDetailsPk,
	updateListing,
} from "../../apiRequest/actions/listingActions";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import Message1 from "../common/Message1";

const EditPropertyScreen = ({ pk, showModal, handleClose }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const listingDetail = useSelector((state) => state.listingDetails);
	const { error, loading, listing } = listingDetail;
	const listingUpdate = useSelector((state) => state.listingUpdate);
	// const {
	// 	error: errorUpdate,
	// 	loading: loadingUpdate,
	// 	listing: updatedlisting,
	// 	success,
	// } = listingUpdate;
	const { loading: loadingUpdate, success } = listingUpdate;
	const [main_photo, setMainPhoto] = useState(null);
	const [uploaded_images, setUploadedImages] = useState(listing.images);
	const [countdown, setCountdown] = useState(3); // set initial countdown to 3 seconds
	var [propertyData, setPropertyData] = useState({
		title: listing.title,
		address: listing.address,
		city: listing.city,
		district: listing.district,
		zipcode: listing.zipcode,
		description: listing.description,
		price: listing.price,
		area: listing.area,
		bedrooms: listing.bedrooms,
		bathrooms: listing.bathrooms,
		main_photo: main_photo,
		images: listing.images || null,
	});
	useEffect(() => {
		dispatch(getListingDetailsPk(pk));
	}, [dispatch, pk]);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setPropertyData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	useEffect(() => {
		if (listing) {
			setPropertyData((prevData) => ({
				...prevData,
				title: listing.title,
				address: listing.address,
				city: listing.city,
				district: listing.district,
				zipcode: listing.zipcode,
				description: listing.description,
				price: listing.price,
				area: listing.area,
				bedrooms: listing.bedrooms,
				bathrooms: listing.bathrooms,
				main_photo: main_photo,
			}));
			setUploadedImages(listing.images || []);
		}
	}, [listing, main_photo]);

	useEffect(() => {
		let interval = null;
		if (success) {
			interval = setInterval(() => {
				setCountdown((prevCountdown) => prevCountdown - 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [success]);

	useEffect(() => {
		if (countdown === 0) {
			handleClose();
		}
	}, [countdown, navigate]);
	useEffect(() => {
		console.log("Uploaded Images:", uploaded_images);
	}, [uploaded_images]);
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("title", propertyData.title);
		formData.append("address", propertyData.address);
		// formData.append('city', propertyData.city);
		// formData.append('district', propertyData.district);
		formData.append("zipcode", propertyData.zipcode);
		// formData.append('description', propertyData.description);
		formData.append("price", propertyData.price);
		formData.append("area", propertyData.area);
		formData.append("bedrooms", propertyData.bedrooms);
		formData.append("bathrooms", propertyData.bathrooms);
		if (uploaded_images.length > 0) {
			uploaded_images.forEach((file, index) => {
				formData.append(`uploaded_images[${index}]`, file);
			});
		}
		console.log(formToJSON(formData));
		dispatch(updateListing(pk, formData));
	};
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setMainPhoto(file);
		setPropertyData((prevData) => ({
			...prevData,
			main_photo: file,
		}));
	};

	const handleMultiFileChange = (event) => {
		const files = Array.from(event.target.files);
		console.log(files);
		setUploadedImages(files);
	};

	const handleImageDelete = (index) => {
		setUploadedImages((prevImages) => {
			const newImages = [...prevImages];
			newImages.splice(index, 1);
			console.log(newImages);
			return newImages;
		});
	};
	return (
		<>
			{loading ? (
				<Loader />
			) : error ? (
				<Message1 variant="danger">{error}</Message1>
			) : (
				listing &&
				listing.title &&
				listing.main_photo &&
				listing.address && (
					<Modal size="lg" show={showModal} onHide={handleClose} centered>
						<Modal.Header closeButton>
							<Modal.Title>Edit Property</Modal.Title>
						</Modal.Header>
						{loadingUpdate && <Loader />}
						{success && (
							<Message1 variant="success">
								Listing created successfully! Redirecting to homepage in{" "}
								<span>{countdown} seconds...</span>
							</Message1>
						)}
						<Modal.Body>
							<Form
								onSubmit={handleSubmit}
								style={{ marginBottom: "3rem", width: "100%" }}>
								<Form.Group controlId="title">
									<Form.Label>Title</Form.Label>
									<Form.Control
										type="text"
										name="title"
										value={propertyData.title}
										placeholder="Title"
										onChange={handleChange}
									/>
								</Form.Group>

								<Form.Group controlId="address">
									<Form.Label>Address</Form.Label>
									<Form.Control
										type="text"
										name="address"
										value={propertyData.address}
										placeholder="Address"
										onChange={handleChange}
									/>
								</Form.Group>
								<Row>
									<Col>
										<Form.Group controlId="city">
											<Form.Label>City</Form.Label>
											<Form.Control
												type="text"
												name="city"
												value={propertyData.city}
												placeholder="city"
												onChange={handleChange}
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="district">
											<Form.Label>District</Form.Label>
											<Form.Control
												type="text"
												name="district"
												value={propertyData.district}
												placeholder="district"
												onChange={handleChange}
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="zipcode">
											<Form.Label>Zipcode</Form.Label>
											<Form.Control
												type="text"
												name="zipcode"
												value={propertyData.zipcode}
												placeholder="zipcode"
												onChange={handleChange}
											/>
										</Form.Group>
									</Col>
								</Row>

								<Row>
									<Col>
										<Form.Group controlId="price">
											<Form.Label>Price</Form.Label>
											<Form.Control
												type="text"
												name="price"
												value={propertyData.price}
												placeholder="price"
												onChange={handleChange}
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="area">
											<Form.Label>Area</Form.Label>
											<Form.Control
												type="text"
												name="area"
												value={propertyData.area}
												placeholder="area"
												onChange={handleChange}
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="bedrooms">
											<Form.Label>Bedrooms</Form.Label>
											<Form.Control
												type="text"
												name="bedrooms"
												value={propertyData.bedrooms}
												placeholder="bedrooms"
												onChange={handleChange}
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="bathrooms">
											<Form.Label>Bathrooms</Form.Label>
											<Form.Control
												type="text"
												name="bathrooms"
												value={propertyData.bathrooms}
												placeholder="bathrooms"
												onChange={handleChange}
											/>
										</Form.Group>
									</Col>
									<Form.Group controlId="main_photo">
										<Form.Label>Main Photo</Form.Label>

										<Form.Control
											type="file"
											name="main_photo"
											accept="image/*"
											value={propertyData.main_photo}
											onChange={handleFileChange}
										/>
										<div>
											{listing.main_photo && (
												<img
													src={listing.main_photo}
													alt="Main Photo"
													style={{ height: "6rem", width: "8rem" }}
												/>
											)}
										</div>
									</Form.Group>
									<Form.Group controlId="formFile">
										<Form.Label>Images</Form.Label>
										<Form.Control
											type="file"
											name="uploaded_images"
											placeholder="images"
											multiple
											onChange={(e) => {
												handleMultiFileChange(e);
											}}
										/>
										<input
											type="file"
											multiple
											onChange={handleMultiFileChange}
										/>
									</Form.Group>
									<div className="row">
										{
											<>
												{listing.images &&
													uploaded_images.map((img, index) => (
														<div
															className={
																uploaded_images.length < 4 ? "col-md-3" : "col"
															}
															key={index}
															style={
																uploaded_images.length <= 4
																	? { height: "8rem" }
																	: { height: "6rem", width: "4rem" }
															}>
															<img src={img.image} alt={`Preview ${index}`} />
															<Button
																variant="danger"
																onClick={() => handleImageDelete(index)}>
																Delete
															</Button>
														</div>
													))}
											</>
										}
									</div>
								</Row>
								{/* Add form fields for other property details */}
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							<Button variant="success" onClick={handleSubmit}>
								Save Changes
							</Button>
						</Modal.Footer>
					</Modal>
				)
			)}
		</>
	);
};

export default EditPropertyScreen;
