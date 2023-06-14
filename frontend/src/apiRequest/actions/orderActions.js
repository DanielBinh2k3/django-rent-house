import {
	ORDER_CREATE_RESET,
	ORDER_PAY_RESET,
} from "../constants/orderConstants";
import {
	ORDER_CREATE_FAIL,
	ORDER_CREATE_REQUEST,
	ORDER_CREATE_SUCCESS,
	ORDER_DETAILS_REQUEST,
	ORDER_DETAILS_FAIL,
	ORDER_DETAILS_SUCCESS,
	ORDER_LIST_MY_REQUEST,
	ORDER_LIST_MY_SUCCESS,
	ORDER_LIST_MY_FAIL,
	ORDER_LIST_MY_RESET,
	ORDER_LIST_REQUEST,
	ORDER_LIST_SUCCESS,
	ORDER_LIST_FAIL,
} from "../constants/orderConstants";
import axios from "axios";
export const createOrder = (order) => async (dispatch) => {
	try {
		dispatch({
			type: ORDER_CREATE_REQUEST,
		});

		const { data } = await axios.post(`/api/listing/order`, order);

		dispatch({
			type: ORDER_CREATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		// const message =
		// 	error.response && error.response.data.message
		// 		? error.response.data.message
		// 		: error.message;
		// dispatch({
		// 	type: ORDER_CREATE_FAIL,
		// 	payload: message,
		// });
		console.log(error);
	}
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: ORDER_DETAILS_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/orders/${id}`, config);

		dispatch({
			type: ORDER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({
			type: ORDER_DETAILS_FAIL,
			payload: message,
		});
	}
};

export const listMyOrders = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: ORDER_LIST_MY_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/listing/order`, config);

		dispatch({
			type: ORDER_LIST_MY_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({
			type: ORDER_LIST_MY_FAIL,
			payload: message,
		});
	}
};

export const listOrders = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: ORDER_LIST_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/orders`, config);

		dispatch({
			type: ORDER_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({
			type: ORDER_LIST_FAIL,
			payload: message,
		});
	}
};
