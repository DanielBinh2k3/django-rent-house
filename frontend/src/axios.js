import axios from "axios";

function createAxiosResponseInterceptor() {
	console.log("running");
	const interceptor = axios.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response.status !== 401) {
				return Promise.reject(error);
			}

			axios.interceptors.response.eject(interceptor);

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
					error.response.config.headers["Authorization"] =
						"Bearer " + response.data.access;
					return axios(error.response.config);
				})
				.catch((error2) => {
					console.log(error2);
					window.confirm(
						"Your Account need to log-in again to access this feature"
					);
					localStorage.clear();
					window.location.href = "/login";

					return Promise.reject(error2);
				})
				.finally(createAxiosResponseInterceptor);
		}
	);
}

createAxiosResponseInterceptor();

function makeRequests() {
	const request1 = axios.get("/api/listing/manage/1000154");
	const request2 = axios.get("/api/listing/manage/1000155");

	Promise.all([request1, request2])
		.then(([response1, response2]) => {
			console.log("Responses1 :", response1.data);
			console.log("Responses2 :", response2.data);
		})
		.catch((error) => {
			console.log("Error:", error);
		});
}

makeRequests();
