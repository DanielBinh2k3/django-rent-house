import axios from "axios";
import {
	LISTING_LIST_FAIL,
	LISTING_LIST_REQUEST,
	LISTING_LIST_SUCCESS,
	LISTING_DETAILS_FAIL,
	LISTING_DETAILS_REQUEST,
	LISTING_DETAILS_SUCCESS,
	LISTING_DELETE_FAIL,
	LISTING_DELETE_REQUEST,
	LISTING_DELETE_SUCCESS,
	LISTING_CREATE_FAIL,
	LISTING_CREATE_REQUEST,
	LISTING_CREATE_SUCCESS,
	LISTING_UPDATE_FAIL,
	LISTING_UPDATE_REQUEST,
	LISTING_UPDATE_SUCCESS,
	LISTING_UPDATE_RESET,
	LISTING_SEARCH_REQUEST,
	LISTING_SEARCH_SUCCESS,
	LISTING_SEARCH_FAIL,
} from "../constants/listingConstants";

export const getPublicListings = () => async (dispatch) => {
	try {
		dispatch({ type: LISTING_LIST_REQUEST });
		const { data } = await axios.get(`/api/listing/get-listings`);
		dispatch({
			type: LISTING_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: LISTING_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const getListingDetails = (slug) => async (dispatch) => {
	try {
		dispatch({ type: LISTING_DETAILS_REQUEST });

		const { data } = await axios.get(`/api/listing/detail?slug=${slug}`);

		dispatch({
			type: LISTING_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: LISTING_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const getListingDetailsPk = (pk) => async (dispatch, getState) => {
	try {
		dispatch({ type: LISTING_DETAILS_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();
		const access_token = localStorage.getItem("access_token");
		const { data } = await axios.get(`/api/listing/manage/${pk}`);

		dispatch({
			type: LISTING_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: LISTING_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const deleteListing = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: LISTING_DELETE_REQUEST });
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.access_token}`,
			},
		};

		const { data } = await axios.delete(`/api/listing/manage/${id}`, config);
		dispatch({
			type: LISTING_DELETE_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: LISTING_DELETE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createListing = (listingData) => async (dispatch, getState) => {
	try {
		dispatch({ type: LISTING_CREATE_REQUEST });
		const {
			userLogin: { userInfo },
		} = getState();
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${userInfo.access_token}`,
			},
		};
		const { data } = await axios.post(
			`/api/listing/manage`,
			listingData,
			config
		);
		dispatch({
			type: LISTING_CREATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: LISTING_CREATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
export const updateListing = (pk, listing) => async (dispatch, getState) => {
	try {
		dispatch({ type: LISTING_UPDATE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${userInfo.access_token}`,
			},
		};

		const { data } = await axios.put(
			`/api/listing/manage/${pk}`,
			listing,
			config
		);

		dispatch({ type: LISTING_UPDATE_SUCCESS, payload: data });

		// Reset listingUpdate state
		dispatch({ type: LISTING_UPDATE_RESET });
	} catch (error) {
		dispatch({
			type: LISTING_UPDATE_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const searchListing = (params) => async (dispatch, getState) => {
	try {
		dispatch({ type: LISTING_SEARCH_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${userInfo.access_token}`,
			},
		};

		const { data } = await axios.get(`/api/listing/search`, params, config);

		dispatch({ type: LISTING_SEARCH_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LISTING_SEARCH_FAIL,
			payload:
				error.response && error.response.data.error
					? error.response.data.error
					: error.message,
		});
	}
};
