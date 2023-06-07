import axios from "axios";
import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_REGISTER_FAIL,
	USER_DETAILS_REQUEST,
	USER_DETAILS_SUCCESS,
	USER_DETAILS_FAIL,
	USER_UPDATE_PROFILE_REQUEST,
	USER_UPDATE_PROFILE_SUCCESS,
	USER_UPDATE_PROFILE_FAIL,
	USER_DETAILS_RESET,
	USER_LIST_REQUEST,
	USER_LIST_SUCCESS,
	USER_LIST_FAIL,
	USER_LIST_RESET,
	USER_DELETE_REQUEST,
	USER_DELETE_SUCCESS,
	USER_DELETE_FAIL,
	USER_UPDATE_SUCCESS,
	USER_UPDATE_FAIL,
	USER_UPDATE_REQUEST,
	USER_RESET_PASSWORD_REQUEST,
	USER_RESET_PASSWORD_SUCCESS,
	USER_RESET_PASSWORD_FAIL,
	USER_RESET_PASSWORD_RESET,
} from "../constants/userConstants";

export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_LOGIN_REQUEST,
		});
		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};
		const user = { email: email, password: password };
		const { data } = await axios.post("auth/user/login", user, config);
		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		localStorage.clear();
		localStorage.setItem(
			"access_token",
			JSON.stringify(data["access_token"]).replace(/"/g, "")
		);
		localStorage.setItem(
			"refresh_token",
			JSON.stringify(data["refresh_token"]).replace(/"/g, "")
		);
		axios.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;
		localStorage.setItem("userInfo", JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const register =
	(name, email, password, rePassword, isRealtor) => async (dispatch) => {
		try {
			dispatch({
				type: USER_REGISTER_REQUEST,
			});
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const { data } = await axios.post(
				"auth/user/register",
				{
					name: name,
					email: email,
					password: password,
					re_password: rePassword,
					is_realtor: isRealtor,
				},
				config
			);
			dispatch({
				type: USER_REGISTER_SUCCESS,
				payload: data,
			});
			dispatch({
				type: USER_LOGIN_SUCCESS,
				payload: data,
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
		} catch (error) {
			dispatch({
				type: USER_REGISTER_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const logout = () => (dispatch) => {
	localStorage.removeItem("userInfo");
	FB.logout();
	dispatch({
		type: USER_LOGOUT,
	});
	dispatch({
		type: USER_DETAILS_RESET,
	});
	dispatch({
		type: USER_LIST_RESET,
	});
};

export const getUserDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DETAILS_REQUEST,
		});
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.get(`auth/user/${id}`, config);
		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const getUpdateUserProfile = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_PROFILE_REQUEST,
		});
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.put(
			`/auth/users/profile/update`,
			user,
			config
		);
		dispatch({
			type: USER_UPDATE_PROFILE_SUCCESS,
			payload: data,
		});
		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});
		localStorage.setItem("userInfo", JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: USER_UPDATE_PROFILE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const listUsers = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_LIST_REQUEST,
		});
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.get(
			`auth/user`,

			config
		);
		dispatch({
			type: USER_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const deleteUsers = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DELETE_REQUEST,
		});
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.delete(`auth/user/delete/${id}`, config);
		dispatch({
			type: USER_DELETE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_DELETE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateUser = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_REQUEST,
		});
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.put(
			`auth/user/update/${user._id}`,
			user,
			config
		);
		dispatch({
			type: USER_UPDATE_SUCCESS,
		});
		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const resetPasswordUser = (password) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_RESET_PASSWORD_REQUEST,
		});
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.patch(
			`/auth/user/password-reset/`,
			password,
			config
		);
		dispatch({
			type: USER_RESET_PASSWORD_SUCCESS,
		});
		dispatch({
			type: USER_RESET_PASSWORD_RESET,
		});
		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_RESET_PASSWORD_FAIL,
			payload:
				error.response && error.response.data.error
					? error.response.data.error
					: error.message,
		});
	}
};
