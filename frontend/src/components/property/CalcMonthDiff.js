const calculateMonthEstimate = (checkInDate, checkOutDate) => {
	const delta = calculateDateDifference(checkInDate, checkOutDate);
	let months = delta.years * 12 + delta.months;

	// Round up to the nearest month if there are remaining days
	if (delta.days > 0) {
		months += 1;
	}

	return months;
};

const calculateDateDifference = (date1, date2) => {
	const diffTime = Math.abs(date2 - date1);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	const years = Math.floor(diffDays / 365);
	const months = Math.floor((diffDays % 365) / 30);
	const days = diffDays % 30;

	return { years, months, days };
};

export default calculateMonthEstimate;
