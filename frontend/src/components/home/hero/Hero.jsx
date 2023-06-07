import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Heading from "../../common/Heading";
import "./hero.css";

const Hero = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState({
    city: "",
    propertyType: "",
    priceRange: "",
  });

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Dispatch the searchListing action with the searchParams
    dispatch(searchListing(searchParams));
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <Heading
            title="Search Your Next Home"
            subtitle="Find new & featured property located in your local city."
          />

          <form className="flex" onSubmit={handleSearch}>
            <div className="box">
              <span>City/Street</span>
              <select
                name="city"
                value={searchParams.city}
                onChange={handleInputChange}
              >
                <option value="">Select City/Street</option>
                <option value="city1">City 1</option>
                <option value="city2">City 2</option>
                <option value="city3">City 3</option>
              </select>
            </div>
            <div className="box">
              <span>Property Type</span>
              <select
                name="propertyType"
                value={searchParams.propertyType}
                onChange={handleInputChange}
              >
                <option value="">Select Property Type</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
              </select>
            </div>
            <div className="box">
              <span>Price Range</span>
              <select
                name="priceRange"
                value={searchParams.priceRange}
                onChange={handleInputChange}
              >
                <option value="">Select Price</option>
                <option value="0-300">0 - 300</option>
                <option value="300-700">300 - 700</option>
                <option value="700-1000">700 - 1000</option>
                <option value="1000"> {'>'} 1000</option>
              </select>
            </div>
            <div className="box">
              <h4>Advance Filter</h4>
            </div>
            <button type="submit" className="btn1">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Hero;
