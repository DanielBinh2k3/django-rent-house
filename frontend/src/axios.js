import axios from "axios";
import { useNavigate } from "react-router-dom";

let refresh = false;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const navigate = useNavigate();
		if (error.response.status === 401 && !refresh) {
			refresh = true;
			console.log(localStorage.getItem("refresh_token"));

			try {
				const response = await axios.post(
					`/api/token/refresh/`,
					{
						refresh: localStorage.getItem("refresh_token"),
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					}
				);
				console.log(response);

				if (response.status === 200) {
					axios.defaults.headers.common[
						"Authorization"
					] = `Bearer ${response.data["access"]}`;
					localStorage.setItem("access_token", response.data.access);
					return axios(error.config);
				}
			} catch (error) {
				// Handle refresh error
				console.log(error);
				if (error.response.status === 401) {
					// Both access token and refresh token have expired
					// Perform the necessary actions such as redirecting the user to the login page, clearing the authentication state, etc.
				} else {
					// Handle other refresh errors
				}
			}
		}

		refresh = false;
		console.log("Both access token and refresh token have expired");
		return Promise.reject(error);
	}
);
