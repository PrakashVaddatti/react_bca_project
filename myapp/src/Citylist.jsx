import React, { useEffect, useState } from "react";
import style from './Citylist.module.css'
function Citylist({ onselectcity }) {
    const [search, setsearch] = useState("");
    const [city, setcity] = useState([]);
    const [filterData, setfilterData] = useState([]);

    const getCityData = async () => {
        const response = await fetch("http://localhost:5000/citylist");
        const result = await response.json();
        setcity(result);
    };

    useEffect(() => {
        getCityData();
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setsearch(val);
        setfilterData(
            val
                ? city.filter((data) =>
                      data.cityname.toLowerCase().startsWith(val.toLowerCase())
                  )
                : []
        );
    };

    const handlecityselection = (selectedCity) => {
        setsearch(selectedCity.cityname);
        setfilterData([]);
        if (onselectcity) {
            onselectcity(selectedCity.cityid);
        } 
    };

    return (
        <div className="form-group">
           
            <input
                type="text"
                
                value={search}
                onChange={handleSearch}
                className="form-control "
                id="cityInput"
                placeholder="City Name"
                required
            />
            {filterData.length > 0 && (
                <ul className={style.ulstyle}>
                    {filterData.map((cityItem) => (
                        <li
                            key={cityItem.cityid} // Unique key
                            className="list-group-item list-group-item-action"
                            onClick={() => handlecityselection(cityItem)}
                        >
                            {cityItem.cityname}
                        </li>
                    ))}
                </ul>
            )}
            <div className="invalid-feedback">A valid city name is required.</div>
        </div>
    );
}

export default Citylist;