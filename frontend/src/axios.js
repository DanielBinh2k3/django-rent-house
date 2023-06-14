import axios from "axios";

// Function to create the Axios response interceptor
function createAxiosResponseInterceptor() {
	console.log("running");

	// Set up the interceptor
	const interceptor = axios.interceptors.response.use(
		// Callback for successful responses
		(response) => response,

		// Callback for errors
		(error) => {
			// If the response status is not 401 (Unauthorized), reject the error and propagate it further
			if (error.response.status !== 401) {
				return Promise.reject(error);
			}

			// Eject the interceptor to prevent recursive calls
			axios.interceptors.response.eject(interceptor);

			// Refresh the token by making a POST request to /api/token/refresh/
			return axios
				.post(
					`/api/token/refresh/`,
					{
						refresh: localStorage.getItem("refresh_token"),
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((response) => {
					console.log(response);

					// Update the Authorization header with the new access token
					error.response.config.headers["Authorization"] =
						"Bearer " + response.data.access;

					// Retry the original request with the updated token
					return axios(error.response.config);
				})
				.catch((error2) => {
					console.log("Error:" + error2);
					if (error2.status === 400) {
						return axios(error.error2.config);
					}
					// Prompt the user to log in again
					window.confirm(
						"Your account needs to log in again to access this feature"
					);

					// Clear the local storage
					localStorage.clear();

					// Redirect to the login page if the user is not already there
					if (window.location.pathname !== "/login") {
						window.location.href = "/login";
					}

					return Promise.reject(error2);
				})
				.finally(createAxiosResponseInterceptor);
		}
	);
}

// Call the function to create the Axios response interceptor
createAxiosResponseInterceptor();

// // Function to make requests using Axios
// function makeRequests() {
// 	// Send two GET requests to different endpoints
// 	const request1 = axios.get("/api/listing/manage/1000154");
// 	const request2 = axios.get("/api/listing/manage/1000155");

// 	// Wait for both requests to resolve or reject
// 	Promise.all([request1, request2])
// 		.then(([response1, response2]) => {
// 			// Log the data from the responses to the console
// 			console.log("Response 1:", response1.data);
// 			console.log("Response 2:", response2.data);
// 		})
// 		.catch((error) => {
// 			// Log any errors to the console
// 			console.log("Error:", error);
// 		});
// }

// // Call the function to make requests
// makeRequests();
