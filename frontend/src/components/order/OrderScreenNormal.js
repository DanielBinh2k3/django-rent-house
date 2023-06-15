import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { listMyOrders } from "../../apiRequest/actions/orderActions";

const OrderScreenNormal = () => {
	const dispatch = useDispatch();
	const myorders = useSelector((state) => state.orderListMy);
	const { loading, error, orders } = myorders;
	const [searchTerm, setSearchTerm] = useState("");
	const [sortedColumn, setSortedColumn] = useState("");
	const [sortDirection, setSortDirection] = useState("");

	useEffect(() => {
		dispatch(listMyOrders());
	}, [dispatch]);

	const handleEditOrder = (orderId) => {
		// Handle edit order logic
		console.log("Edit Order:", orderId);
	};

	const handleDeleteOrder = (orderId) => {
		// Handle delete order logic
		console.log("Delete Order:", orderId);
	};

	const handleSort = (column) => {
		if (sortedColumn === column && sortDirection === "asc") {
			setSortDirection("desc");
		} else {
			setSortedColumn(column);
			setSortDirection("asc");
		}
	};

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};
	let filteredOrders = [];
	if (orders) {
		filteredOrders = orders.filter((order) => {
			for (let key in order) {
				if (
					typeof order[key] === "string" &&
					order[key].toLowerCase().includes(searchTerm.toLowerCase())
				) {
					return true;
				}
			}
			return false;
		});
	}

	const sortedOrders = [...filteredOrders].sort((a, b) => {
		if (sortDirection === "asc") {
			return a[sortedColumn].localeCompare(b[sortedColumn]);
		} else if (sortDirection === "desc") {
			return b[sortedColumn].localeCompare(a[sortedColumn]);
		}
		return 0;
	});

	return (
		<div className="container padding">
			<h2>My Orders</h2>
			<div style={{ marginBottom: "2rem" }}>
				<input
					type="text"
					placeholder="Search by Renter Name"
					value={searchTerm}
					onChange={handleSearch}
				/>
			</div>
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p>Error: {error}</p>
			) : (
				<MDBTable striped small bordered>
					<MDBTableHead>
						<tr>
							<th onClick={() => handleSort("listing")}>
								Listing
								{sortedColumn === "listing" && (
									<span>{sortDirection === "asc" ? "▲" : "▼"}</span>
								)}
							</th>
							<th onClick={() => handleSort("renter_name")}>
								Renter Name
								{sortedColumn === "renter_name" && (
									<span>{sortDirection === "asc" ? "▲" : "▼"}</span>
								)}
							</th>
							<th onClick={() => handleSort("renter_email")}>
								Renter Email
								{sortedColumn === "renter_email" && (
									<span>{sortDirection === "asc" ? "▲" : "▼"}</span>
								)}
							</th>
							<th onClick={() => handleSort("date_in")}>
								Date In
								{sortedColumn === "date_in" && (
									<span>{sortDirection === "asc" ? "▲" : "▼"}</span>
								)}
							</th>
							<th onClick={() => handleSort("date_out")}>
								Date Out
								{sortedColumn === "date_out" && (
									<span>{sortDirection === "asc" ? "▲" : "▼"}</span>
								)}
							</th>
							<th onClick={() => handleSort("months_estimate")}>
								Months(est)
								{sortedColumn === "months_estimate" && (
									<span>{sortDirection === "asc" ? "▲" : "▼"}</span>
								)}
							</th>
							<th onClick={() => handleSort("total_price")}>
								Total Price
								{sortedColumn === "total_price" && (
									<span>{sortDirection === "asc" ? "▲" : "▼"}</span>
								)}
							</th>
							<th>Actions</th>
						</tr>
					</MDBTableHead>
					<MDBTableBody>
						{sortedOrders.map((order, index) => (
							<tr key={index}>
								<td>{order.listing}</td>
								<td>{order.renter_name}</td>
								<td>{order.renter_email}</td>
								<td>{order.date_in}</td>
								<td>{order.date_out}</td>
								<td>{order.months_estimate}</td>
								<td>{order.total_price}</td>
								<td>
									<div className="row">
										<div className="col-md-4">
											<FaEdit onClick={() => handleEditOrder(order.id)} />
										</div>
										<div className="col-md-4">
											<FaTrashAlt onClick={() => handleDeleteOrder(order.id)} />
										</div>
									</div>
								</td>
							</tr>
						))}
					</MDBTableBody>
				</MDBTable>
			)}
		</div>
	);
};

export default OrderScreenNormal;
