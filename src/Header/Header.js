import { CardContent, FormControl, MenuItem, Select, Card } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import InfoBox from "../InfoBox/InfoBox";
import './Header.css';
import Map from "../Map/Map";
import Table from "../Table/Table";
import { sortData, prettyPrintStat } from '../util';

import LineGraph from "../LineGraph/LineGraph";
import "leaflet/dist/leaflet.css";



function Header() {

    const [country, setCountry] = useState("worldwide")
    const [countries, setCountries] = useState([]);
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, settableData] = useState([]);
    const [mapCountries, setMapCountries] = useState([]);
    const [mapCenter, setmapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
    const [mapZoom, setMapZoom] = useState(3);
    const [casesType, setCasesType] = useState("cases");

    {/* This useeffect hook is for getting all the cases when the website is loaded beacuse as default in dropdown Worldwide is selected */ }
    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then(data => {
                setCountryInfo(data);
            })
    }, [])

    {/*This useeffect hook is for getting the countries in drop down*/ }
    useEffect(() => {
        {/*get Country name and country code from below link - parameter values are country and countryInfo.iso2 */ }
        {/*Convert response  to json object and using the required paramters*/ }
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = (data).map((country) => ({
                        name: country.country, // India, Uinted Kingdom, United States
                        value: country.countryInfo.iso2, // IND, UK, US
                    }));
                    setCountries(countries);
                    {/*  Sort the dat by most number of cases by using util.js file*/ }
                    let sortedData = sortData(data);
                    settableData(sortedData);
                    setMapCountries(data);
                })
        }
        getCountriesData();
    }, [])

    const onCountryChange = (event) => {
        const countryCode = event.target.value;
        //console.log(countrycode);
        // this function make when country is selected from dropdown it is displayed on ui
        {/*Display the values in InfoBoxes based on the country selected in dropdown */ }
        const url = countryCode === 'worldwide' ? "https://disease.sh/v3/covid-19/all"
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                {/*This will get all the data for the particular country from url */ }
                setCountryInfo(data);
                setmapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            })
    };
    return (
        <div className="header">
            <div className="header__left">
                <div className="header__main">
                    {/*Header */}
                    <h1>COVID-19 TRACKER</h1>
                    {/* Dropdown */}
                    <FormControl className="header__dropdown">
                        <Select variant="outlined" value={country} onChange={onCountryChange}>
                            {/*Default value should be worldwide when dropdown button is clicked */}
                            <MenuItem value="worldwide">Worldwide</MenuItem>
                            {/*Drop down should be consisting of all countires */}
                            {countries.map((country) => (
                                <MenuItem value={country.value}>{country.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="header__stats">
                    < InfoBox title="CoronaViues Cases"
                        onClick={(e) => setCasesType("cases")}
                        title="Coronavirus Cases"
                        isRed
                        active={casesType === "cases"}
                        cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases} />
                    < InfoBox title="Recovered"
                        onClick={(e) => setCasesType("recovered")}
                        title="Recovered"
                        active={casesType === "recovered"}
                        cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered} />
                    < InfoBox title="Death"
                        onClick={(e) => setCasesType("deaths")}
                        title="Deaths"
                        isRed
                        active={casesType === "deaths"} cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths} />
                </div>
                <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
            </div>

            <Card className="header__right">
                <CardContent>
                    <h3>Live Cases by Country</h3>
                    {/* getting the countries and their respective cases from table.js */}
                    <Table countries={tableData} />
                    <h3 className="header__graph">WorldWide New {casesType}</h3>
                    <LineGraph casesType={casesType} />
                </CardContent>
            </Card>

        </div>
    )
}

export default Header
