import React, { useEffect, useState } from "react";
import "./propertyScreen.css";
import { FiShare } from "react-icons/fi";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import {
	FacebookIcon,
	FacebookShareButton,
	TwitterShareButton,
	TwitterIcon,
	TelegramShareButton,
	TelegramIcon,
} from "react-share";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getListingDetails } from "../../apiRequest/actions/listingActions";
import Loader from "../common/Loader";
import Message1 from "../common/Message1";
import OrderCreateScreen from "../order/OrderCreateScreen";
import calculateMonthEstimate from "./CalcMonthDiff";
import MyMapComponent from "./MyMap";

const PropertyScreen = () => {
	const dispatch = useDispatch();
	var newStartDate = new Date();
	var newEndDate = new Date();

	const navigate = useNavigate();
	const { slug } = useParams();
	const listingDetails = useSelector((state) => state.listingDetails);
	const { error, loading, listing } = listingDetails;
	const listingDetail = listing && listing.listing;

	const [showOrder, setShowOrder] = useState(false);
	const [showReport, setShowReport] = useState(false);
	const handleClose = () => {
		setShowOrder(false);
	};
	useEffect(() => {
		dispatch(getListingDetails(slug));
		// const address = listingDetail.address;
		// console.log(address);
	}, [dispatch, slug]);

	const [selectionRange, setSelectionRange] = useState({
		startDate: new Date(),
		endDate: new Date(),
		key: "selection",
	});
	let month = calculateMonthEstimate(
		selectionRange.startDate,
		selectionRange.endDate
	);
	const [isSelectionDone, setIsSelectionDone] = useState(false);
	const handleSelect = (ranges) => {
		const { startDate, endDate } = ranges.selection;

		if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
			const newStartDate = new Date(startDate.getTime());
			setSelectionRange({
				...ranges.selection,
				startDate: newStartDate,
				key: "selection",
			});
			setIsSelectionDone(true);
		} else {
			console.log(
				"Invalid selection. Please choose both 'Early' and 'Continuous' dates."
			);
			setSelectionRange({
				startDate: new Date(),
				endDate: new Date(),
				key: "selection",
			});
			setIsSelectionDone(false);
		}
	};

	function HTMLRenderer(props) {
		return <div dangerouslySetInnerHTML={{ __html: props.html }} />;
	}

	const buttonStyles = {
		backgroundColor: "transparent",
		border: "none",
		padding: "0px",
		font: "inherit",
		color: "inherit",
		cursor: "pointer",
	};
	const elementStyles = {
		paddingTop: "48px",
		paddingBottom: "24px",
	};
	const horizontalLine = {
		borderTop: "1px solid #ccc",
		margin: "24px 0",
	};
	const imageStyle = {
		height: "12rem",
		width: "18rem",
	};
	if (error === "Request failed with status code 404") {
		navigate("/404");
	}
	return (
		<>
			{loading ? (
				<Loader />
			) : error ? (
				<Message1 variant="danger">{error}</Message1>
			) : (
				listing &&
				listing.listing && (
					<div className="container _2hs30c padding-property ">
						{/* Title */}
						<div className="row">
							<div className="_b8stb0">
								<span className="_1n81at5">
									<h3 tabindex="-1" className="hghzvl1 i1wofiac">
										{listingDetail.title}
									</h3>
								</span>
							</div>
							<div className="w-100"></div>
							<div className="col-12 col-sm-6 col-md-8">
								<div className="_1qdp1ym">
									<div className="_dm2bj1">
										<span className="_1jvg42j ">
											<span className="_12m9c11 "></span>
										</span>
										<span className="_17p6nbba" aria-hidden="true">
											4.92
										</span>
										<span aria-hidden="true">·</span>
										<span className="_s65ijh7">595 reviews</span>
										<span aria-hidden="true">·</span>
										<span className="_s65ijh7">{listingDetail.address}</span>
									</div>
								</div>
							</div>
							<div className="col-6 col-md-3 row">
								<div className="col" style={{ height: "10px" }}>
									<FacebookShareButton url="https://www.facebook.com/">
										<FacebookIcon size={24} round={true} />
									</FacebookShareButton>
									<TwitterShareButton url="https://www.twitter.com/">
										<TwitterIcon size={24} round={true} />
									</TwitterShareButton>
									<TelegramShareButton url="https://www.telegram.com/">
										<TelegramIcon size={24} round={true} />
									</TelegramShareButton>
								</div>
								<div className="col-8">
									<button style={buttonStyles}>
										<MdFavoriteBorder />
										<span className="_s65ijh7">Favorite</span>
									</button>
								</div>
							</div>
						</div>
						{/* Image */}
						<div className="row padding-property">
							<div className="col-md-6" style={{ height: "26.5rem" }}>
								<img src={listingDetail.main_photo}></img>
							</div>
							<div className="col-md-6" style={{ height: "28rem" }}>
								<div className="row">
									<div className="col-6" style={imageStyle}>
										<img src={listingDetail.photo1}></img>
									</div>
									<div className="col-6" style={imageStyle}>
										<img src={listingDetail.photo2}></img>
									</div>
								</div>
								<div style={{ paddingTop: "24px" }}></div>
								<div className="row">
									<div className="col-6" style={imageStyle}>
										<img src={listingDetail.photo3}></img>
									</div>
									<div className="col-6" style={imageStyle}>
										<img src={listingDetail.photo4}></img>
									</div>
								</div>
							</div>
						</div>

						<div className="_gpz5gq">
							{/* Main Content */}
							<div className="main-content" style={elementStyles}>
								{/* Infomation  */}
								<div className="row">
									<div className="col-11">
										<h3
											tabindex="-1"
											className="hghzvl1 i1wofiac "
											style={{ fontSize: "1.5rem", fontWeight: "500" }}>
											Room hosted by {listingDetail.realtor}
										</h3>
									</div>
									<div className="col">
										<img
											className="rounded"
											src="https://lh3.googleusercontent.com/ogw/AOLn63FNpotQGl1xsukyIjPyqS5AkG9ThmkKO8b6xMpzPA=s32-c-mo"
										/>
									</div>
								</div>
								<div class="address">{listingDetail.address}</div>

								<div style={horizontalLine}></div>
								{/* Main Information */}
								<div class="info-attrs clearfix">
									<div class="info-attr clearfix">
										<span>Used Area</span>
										<span>
											{listingDetail.area} m<sup>2</sup>
										</span>
									</div>
									<div class="info-attr clearfix">
										<span>Bedrooms</span>
										<span>{listingDetail.bedrooms}</span>
									</div>
									<div class="info-attr clearfix">
										<span>Bathrooms</span>
										<span>{listingDetail.bathrooms}</span>
									</div>
									<div class="info-attr clearfix">
										<span>Legal</span>
										<span>
											{listingDetail.legal ? listingDetail.legal : "undefined"}
										</span>
									</div>
									<div class="info-attr clearfix">
										<span>Date Created</span>
										<span>{listingDetail.date_created}</span>
									</div>
									<div class="info-attr clearfix">
										<span>ID Property</span>
										<span>{listingDetail.id}</span>
									</div>
								</div>
								<div style={horizontalLine}></div>
								{/* Description */}
								<div className="info-title">
									<h4>Description</h4>
								</div>

								<HTMLRenderer html={listingDetail.description} />
								<div style={horizontalLine}></div>
								{/* Banner Rent Cover */}
								<div>
									<section>
										<div class="cnlfh1x dir dir-ltr">
											<h2
												tabindex="-1"
												class="hghzvl1 dir dir-ltr"
												elementtiming="LCP-target">
												<img
													class="l1li2ovm dir dir-ltr"
													src="https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg"
													alt="AirCover"
												/>
											</h2>
											<div class="tgbzqhs dir dir-ltr">
												Every booking includes free protection from Host
												cancellations, listing inaccuracies, and other issues
												like trouble checking&nbsp;in.
											</div>
											<span aria-label="Learn more" className="_s65ijh7">
												Learn more
											</span>
										</div>
									</section>
								</div>
								<div style={horizontalLine}></div>

								{/* Where You'll Sleep */}
								<div>
									<div className="info-title">
										<h4>Where you'll sleep</h4>
									</div>
									<div className="col-6 rounded">
										<img src="https://a0.muscache.com/im/pictures/miso/Hosting-23206143/original/e7da1f36-922f-4631-a287-91ceda05970f.jpeg?im_w=1200"></img>
									</div>
								</div>
								<div style={horizontalLine}></div>
							</div>

							{/* SideBar for order */}
							{showOrder && (
								<OrderCreateScreen
									showModal={showOrder}
									handleClose={() => handleClose()}
									dateIn={selectionRange.startDate}
									dateOut={selectionRange.endDate}
									listing={listingDetail}
								/>
							)}
							<div className="sidebar-order padding-property">
								<div
									className="card shadow"
									style={{ width: "24rem", padding: "0px 20px" }}>
									<div className="card-body">
										<h5 className="card-title row">
											<div className="price-info col-md-8">
												{listingDetail.price}$
												<span className="_s65ijh7">month</span>
											</div>
											<div className="col-md-4" style={{ scale: "0.8" }}>
												{" "}
												<AiFillStar />
												4.9
											</div>
										</h5>
										<div className="text-center">
											{!isSelectionDone ? (
												<DateRange
													ranges={[selectionRange]}
													onChange={handleSelect}
												/>
											) : (
												<div
													className="selected-range"
													onClick={() => {
														setIsSelectionDone(!isSelectionDone);
														setSelectionRange({
															startDate: newStartDate,
															endDate: newEndDate,
															key: "selection",
														});
													}}>
													<div className="date-range-box v-100">
														<span className="start-date">
															{format(selectionRange.startDate, "dd MMM yyyy")}
														</span>
														<span className="separator">-</span>
														<span className="end-date">
															{format(selectionRange.endDate, "dd MMM yyyy")}
														</span>
													</div>
												</div>
											)}
											<button
												href="#"
												className="col-9 btn btn-block btn-dark"
												style={{ marginTop: "24px" }}
												onClick={() => {
													setShowOrder(true);
												}}>
												Order here
											</button>
											<a
												href={`tel:${
													listingDetail.contact
														? listingDetail.contact
														: "555-555-5555"
												}`}
												className="col-9 btn btn-block btn-success"
												style={{ marginTop: "12px" }}>
												{listingDetail.contact
													? listingDetail.contact
													: "555-555-5555"}
											</a>

											<p style={{ paddingTop: "6px" }}>
												You won't be charge yet
											</p>
										</div>
										<div>
											{/* Money price estimate */}
											<div className="row p-1">
												<span
													className="col-md-9 _s65ijh7"
													style={{ fontWeight: "100" }}>
													Money Price x Month
												</span>
												<span className="col-md-3">
													${parseInt(month) * listingDetail.price}
												</span>
											</div>
											{/* Other fee */}
											<div className="row p-1">
												<span
													className="col-md-9 _s65ijh7"
													style={{ fontWeight: "100" }}>
													Other Fee
												</span>
												<span className="col-md-3">
													${parseInt(0.2 * listingDetail.price)}
												</span>
											</div>
											{/* Service fee  */}
											<div className="row p-1">
												<span
													className="col-md-9 _s65ijh7"
													style={{ fontWeight: "100" }}>
													App fee
												</span>
												<span className="col-md-3">
													${parseInt(0.01 * listingDetail.price)}
												</span>
											</div>
										</div>
										<div style={horizontalLine}></div>
										<div className="row">
											<div className="col-md-9">
												<h5>
													<b>Total Price</b>
												</h5>
												(without tax)
											</div>
											<div className="col-md-3">
												<b>
													$
													{parseInt(
														parseInt(month) * listingDetail.price +
															listingDetail.price * 0.21
													)}
												</b>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Where You'll be*/}
						<div>
							<div className="info-title">
								<h4>Where you'll sleep</h4>
							</div>
							<MyMapComponent />
						</div>
						<div style={horizontalLine}></div>
						{/* Things To Know */}
					</div>
				)
			)}
		</>
	);
};

export default PropertyScreen;
