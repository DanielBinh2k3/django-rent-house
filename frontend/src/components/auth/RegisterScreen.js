import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../common/Message1";
import Loader from "../common/Loader";
import { register } from "../../apiRequest/actions/userActions";
import { Form } from "react-bootstrap";

const RegisterScreen = () => {
	const myStyle = {
		/* fallback for old browsers */
		background: "#6a11cb",

		/* Chrome 10-25, Safari 5.1-6 */
		background:
			"-webkit-linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))",

		scale: "0.9",
	};

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rePassword, setRePassword] = useState("");
	const [isRealtor, setIsRealtor] = useState(false);

	const searchParams = new URLSearchParams(useLocation().search);
	const redirect = searchParams.get("redirect") || "/";

	const dispatch = useDispatch();
	const userRegister = useSelector((state) => state.userRegister);
	const { error, loading, userInfo } = userRegister;

	const navigate = useNavigate();

	useEffect(() => {
		if (userInfo) {
			navigate("/login");
		}
	}, [userInfo, redirect, navigate]);

	const submitHandler = (e) => {
		e.preventDefault();
		console.log(name, email, password, rePassword, isRealtor);
		dispatch(register(name, email, password, rePassword, isRealtor));
	};

	return (
		<>
			{error && <Message variant="danger">{error}</Message>}
			{loading && <Loader />}
			<Form className="vh-100" style={myStyle} onSubmit={submitHandler}>
				<div className="container py-5 h-100" style={myStyle}>
					<div className="row d-flex justify-content-center align-items-center">
						<div className="col-12 col-md-8 col-lg-6 col-xl-5">
							<div
								className="bg-dark text-white"
								style={{ borderRadius: "1rem" }}>
								<div className="card-body p-5 text-center">
									<div className="mb-md-5 mt-md-4 pb-5">
										<h2 className="fw-bold mb-2 text-uppercase">Register</h2>
										<p className="text-white-50 mb-5">
											Please fill out the following information form.
										</p>

										<div className="form-outline form-white mb-4">
											<input
												type="text"
												className="form-control form-control-lg"
												placeholder="Enter Name"
												value={name}
												onChange={(e) => {
													setName(e.target.value);
												}}
											/>
										</div>

										<div className="form-outline form-white mb-4">
											<input
												type="text"
												className="form-control form-control-lg"
												placeholder="Enter Email"
												value={email}
												onChange={(e) => {
													setEmail(e.target.value);
												}}
											/>
										</div>

										<div className="form-outline form-white mb-4">
											<input
												type="password"
												className="form-control form-control-lg"
												placeholder="Enter Password"
												value={password}
												onChange={(e) => {
													setPassword(e.target.value);
												}}
											/>
										</div>

										<div className="form-outline form-white mb-4">
											<input
												type="password"
												className="form-control form-control-lg"
												placeholder="Enter Again Your Password"
												value={rePassword}
												onChange={(e) => {
													setRePassword(e.target.value);
												}}
											/>
										</div>

										<Form.Group
											controlId="selectBox"
											className="form-outline mb-4">
											<Form.Select
												className="form-control form-control-lg"
												value={isRealtor.toString()}
												onChange={(e) =>
													setIsRealtor(e.target.value === "true")
												}>
												<option value="">--Type of user--</option>
												<option value="false">Normal User</option>
												<option value="true">Realtor User</option>
											</Form.Select>
										</Form.Group>

										<div className="mb-4 form-check">
											<input
												type="checkbox"
												className="form-check-input"
												id="termsAndConditions"
												required
											/>
											<label
												className="form-check-label"
												htmlFor="termsAndConditions"
												style={{ color: "white" }}>
												I agree to the{" "}
												<a href="#!" style={{ color: "yellow" }}>
													Terms and Conditions
												</a>{" "}
												and{" "}
												<a href="#!" style={{ color: "yellow" }}>
													Privacy Policy
												</a>
												.
											</label>
										</div>

										<button
											className="btn btn-outline-light btn-lg px-5"
											type="submit">
											Register
										</button>

										<div className="d-flex justify-content-center text-center mt-4 pt-1">
											<a href="#!" className="text-white">
												<i className="fab fa-facebook-f fa-lg"></i>
											</a>
											<a href="#!" className="text-white">
												<i className="fab fa-twitter fa-lg mx-4 px-2"></i>
											</a>
											<a href="#!" className="text-white">
												<i className="fab fa-google fa-lg"></i>
											</a>
										</div>
									</div>

									<div>
										<p className="mb-0">
											You have account yet?{" "}
											<a href="/login" className="text-white-50 fw-bold">
												Sign In Here
											</a>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Form>
			<div style={{ paddingBottom: "5rem" }}></div>
		</>
	);
};

export default RegisterScreen;
