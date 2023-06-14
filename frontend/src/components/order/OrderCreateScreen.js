import React, { useEffect, useState } from "react";
import {
	Form,
	Button,
	Modal,
	Col,
	Card,
	ListGroup,
	Row,
	Image,
} from "react-bootstrap";
import FormContainer from "../common/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";
import Message1 from "../common/Message1";
import calculateMonthEstimate from "../property/CalcMonthDiff";
import { formToJSON } from "axios";
import { createOrder } from "../../apiRequest/actions/orderActions";
const OrderCreateScreen = ({
	showModal,
	handleClose,
	dateIn,
	dateOut,
	listing,
}) => {
	const [step, setStep] = useState(1);
	const [countdown, setCountdown] = useState(3); // set initial countdown to 3 seconds
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;
	const createdOrder = useSelector((state) => state.orderCreate);
	const { loading, error, success } = createdOrder;

	const [formData, setFormData] = useState({
		renterName: userInfo.name,
		renterEmail: userInfo.email,
		renterPhone: "",
		dateIn: dateIn.toISOString().split("T")[0],
		dateOut: dateOut.toISOString().split("T")[0],
	});
	let monthsEstimate = calculateMonthEstimate(
		new Date(formData.dateIn),
		new Date(formData.dateOut)
	);
	let totalPrice = parseInt(listing.price * monthsEstimate * 1.21);
	const handleChange = (event) => {
		setFormData((prevFormData) => {
			const updatedFormData = {
				...prevFormData,
				[event.target.name]: event.target.value,
			};

			if (
				(event.target.name === "dateIn" &&
					updatedFormData.dateIn > updatedFormData.dateOut) ||
				(event.target.name === "dateOut" &&
					updatedFormData.dateOut < updatedFormData.dateIn)
			) {
				window.alert('The selected "Date In" must be before the "Date Out".');
				return prevFormData; // Return the previous state to prevent updating
			}

			return updatedFormData;
		});
	};
	const order = {
		_id: "123456789", // Example order ID
		user: {
			name: "John Doe",
			email: "johndoe@example.com",
		},
		shippingAddress: {
			address: "123 Main St",
			city: "New York",
			postalCode: "10001",
			country: "United States",
		},
		isDelivered: false,
		deliveredAt: null,
		paymentMethod: "PayPal",
		isPaid: false,
		paidAt: null,
		orderItems: [
			{
				name: "Product 1",
				image: "product1.jpg",
				price: 10.99,
				qty: 2,
				product: "product1_id",
			},
			{
				name: "Product 2",
				image: "product2.jpg",
				price: 19.99,
				qty: 1,
				product: "product2_id",
			},
		],
		itemsPrice: 41.97, // Total price of all items
		shippingPrice: 5.0,
		taxPrice: 3.14,
		totalPrice: 50.11, // Total order price including shipping and tax
	};
	const handleNextStep = (event) => {
		event.preventDefault();
		setStep((prevStep) => prevStep + 1);
	};

	const handlePreviousStep = (event) => {
		event.preventDefault();
		setStep((prevStep) => prevStep - 1);
	};

	const handleStep1 = (event) => {
		event.preventDefault();

		if (!totalPrice) {
			window.alert("Please choose date-out again.");
		} else {
			handleNextStep(event);
		}
	};

	const submitHandler = (event) => {
		event.preventDefault();
		const formOrder = new FormData();
		formOrder.append("renter_phone", formData.renterPhone);
		formOrder.append("date_in", formData.dateIn);
		formOrder.append("date_out", formData.dateOut);
		formOrder.append("listing", listing.id);
		console.log(formToJSON(formOrder));
		dispatch(createOrder(formOrder));
	};

	// useEffect(() => {
	// 	let interval = null;
	// 	if (success) {
	// 		interval = setInterval(() => {
	// 			setCountdown((prevCountdown) => prevCountdown - 1);
	// 		}, 1000);
	// 	}
	// 	return () => clearInterval(interval);
	// }, [success]);

	// useEffect(() => {
	// 	if (countdown === 0) {
	// 		navigate("/");
	// 	}
	// }, [countdown, navigate]);

	return (
		<>
			<Modal size="lg" show={showModal} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>Rental Order</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{loading && <Loader />}
					{error && <Message1 variant="danger">{error}</Message1>}

					{step === 1 && (
						<FormContainer>
							<Form style={{ height: "500px" }}>
								<Form.Group controlId="renterName">
									<Form.Label>Renter Name</Form.Label>
									<Form.Control
										type="text"
										name="renterName"
										value={formData.renterName}
										disabled
									/>
								</Form.Group>
								<Form.Group controlId="email">
									<Form.Label>Email</Form.Label>
									<Form.Control
										type="text"
										name="renterEmail"
										value={formData.renterEmail}
										disabled
									/>
								</Form.Group>

								<Form.Group controlId="contactPhone">
									<Form.Label>Contact Phone</Form.Label>
									<Form.Control
										type="text"
										name="renterPhone"
										value={formData.renterPhone}
										onChange={handleChange}
									/>
								</Form.Group>
								<Row>
									<Col md={6}>
										{" "}
										<Form.Group controlId="date-in">
											<Form.Label>Date In</Form.Label>
											<Form.Control
												type="date"
												name="dateIn"
												value={formData.dateIn}
												onChange={handleChange}
											/>
										</Form.Group>
									</Col>
									<Col md={6}>
										{" "}
										<Form.Group controlId="date-out">
											<Form.Label>Date Out</Form.Label>
											<Form.Control
												type="date"
												name="dateOut"
												value={formData.dateOut}
												onChange={handleChange}
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col md={5}>
										{" "}
										<Form.Group controlId="time">
											<Form.Label>Month Estimate</Form.Label>
											<Form.Control
												type="number"
												value={monthsEstimate}
												disabled
											/>
										</Form.Group>
									</Col>
									<Col md={7}>
										{" "}
										<Form.Group controlId="fee">
											<Form.Label>Fee</Form.Label>
											<Form.Control type="number" value={totalPrice} disabled />
										</Form.Group>
									</Col>
								</Row>
							</Form>
							<div className="row" style={{ height: "5%" }}>
								<div className="col-md-6">
									<Button
										className="btn btn-lg w-100 btn-dark"
										type="submit"
										onClick={handleStep1}>
										Next
									</Button>
								</div>
							</div>
						</FormContainer>
					)}

					{step === 2 && (
						<FormContainer>
							<Form style={{ height: "500px" }}>
								<Form.Group controlId="smtp">
									<Form.Label>SMTP</Form.Label>
									<Form.Control type="text" placeholder="Enter SMTP" />
								</Form.Group>
							</Form>
							<div className="row" style={{ height: "5%" }}>
								<div className="col-md-6">
									<Button
										className="btn btn-lg w-100 btn-secondary"
										type="button"
										onClick={handlePreviousStep}>
										Previous
									</Button>
								</div>
								<div className="col-md-6">
									<Button
										className="btn btn-lg w-100 btn-dark"
										type="button"
										onClick={handleNextStep}>
										Next
									</Button>
								</div>
							</div>
						</FormContainer>
					)}

					{step === 3 && (
						<Form style={{ marginBottom: "3rem" }} onSubmit={submitHandler}>
							<div>
								<h2>Order: {order._id}</h2>
								<Row>
									<Col md={8}>
										<ListGroup variant="flush">
											<ListGroup.Item>
												<h2>Shipping</h2>
												<p>
													Name: <strong>{order.user.name}</strong>
												</p>
												<p>
													Email:{" "}
													<strong>
														<a href={`mailto:${order.user.email}`}>
															{order.user.email}
														</a>
													</strong>
												</p>
												<p>
													<strong>Shipping: </strong>
													{order.shippingAddress.address},{" "}
													{order.shippingAddress.city}
													{"  "}
													{order.shippingAddress.postalCode},{"  "}
													{order.shippingAddress.country}
												</p>
												{order.isDelivered ? (
													<Message1 variant="success">
														Delivered on {order.deliveredAt}
													</Message1>
												) : (
													<Message1 variant="warning">Not Delivered</Message1>
												)}
											</ListGroup.Item>

											<ListGroup.Item>
												<h2>Order Items</h2>
												<ListGroup variant="flush">
													{order.orderItems.map((item, index) => (
														<ListGroup.Item key={index}>
															<Row>
																<Col md={1}>
																	<Image
																		src={item.image}
																		alt={item.name}
																		fluid
																		rounded
																	/>
																</Col>

																<Col>
																	<Link to={`/product/${item.product}`}>
																		{item.name}
																	</Link>
																</Col>

																<Col md={4}>
																	{item.qty} X ${item.price} = $
																	{(item.qty * item.price).toFixed(2)}
																</Col>
															</Row>
														</ListGroup.Item>
													))}
												</ListGroup>
											</ListGroup.Item>
										</ListGroup>
									</Col>

									<Col md={4}>
										<Card>
											<ListGroup variant="flush">
												<ListGroup.Item>
													<h2>Order Summary</h2>
												</ListGroup.Item>

												<ListGroup.Item>
													<Row>
														<Col>Items:</Col>
														<Col>${order.itemsPrice}</Col>
													</Row>
												</ListGroup.Item>
												<ListGroup.Item>
													<Row>
														<Col>Tax:</Col>
														<Col>${order.taxPrice}</Col>
													</Row>
												</ListGroup.Item>

												<ListGroup.Item>
													<Row>
														<Col>Total:</Col>
														<Col>${order.totalPrice}</Col>
													</Row>
												</ListGroup.Item>

												<ListGroup.Item>
													{error && (
														<Message1 variant="danger">{error}</Message1>
													)}
												</ListGroup.Item>

												{/* {!order.isPaid && (
													<ListGroup.Item>
														{loadingPay && <Loader />}

														{!sdkReady ? (
															<Loader />
														) : (
															<PayPalButton
																amount={order.totalPrice}
																onSuccess={successPaymentHandler}
															/>
														)}
													</ListGroup.Item>
												)}

												{loadingDeliver && <Loader />}
												{userInfo &&
													userInfo.isAdmin &&
													order.isPaid &&
													!order.isDelivered && (
														<ListGroup.Item>
															<Button
																type="button"
																className="btn btn-block"
																onClick={successDeliverHandler}>
																Mark as Delivered
															</Button>
														</ListGroup.Item>
													)} */}
											</ListGroup>
										</Card>
									</Col>
								</Row>
							</div>

							<div className="row" style={{ height: "5%" }}>
								<div className="col-md-6">
									<Button
										className="btn btn-lg w-100 btn-secondary"
										type="button"
										onClick={handlePreviousStep}>
										Previous
									</Button>
								</div>
								<div className="col-md-6">
									<Button
										className="btn btn-lg w-100 btn-dark"
										onClick={submitHandler}>
										Save Order
									</Button>
								</div>
							</div>
						</Form>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default OrderCreateScreen;
