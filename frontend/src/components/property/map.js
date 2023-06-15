import React, { useState } from "react";
import {
	GeoapifyGeocoderAutocomplete,
	GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "./map.css";
const App = () => {
	function onPlaceSelect(value) {
		console.log(value);
	}

	function onSuggectionChange(value) {
		console.log(value);
	}

	return (
		<div className="container padding">
			<GeoapifyContext apiKey="8c3effce14cf42138616e217e61d9e74">
				<GeoapifyGeocoderAutocomplete
					placeholder="Enter address here"
					// type={type}
					// lang={language}
					// position={position}
					// countryCodes={countryCodes}
					// limit={limit}
					// value={displayValue}
					placeSelect={onPlaceSelect}
					suggestionsChange={onSuggectionChange}
				/>
			</GeoapifyContext>
		</div>
	);
};

export default App;
