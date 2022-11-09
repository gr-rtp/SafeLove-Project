import React, {useState, useCallback , useRef, useEffect} from "react";
import Map from "./Map";
import DisplayRestaurants from './DisplayRestaurants';
import axios from 'axios';
import './style.css';

function MapLoader(){

  const [restaurantDetails, setRestaurantDetails] = useState([]);
  const classRef = useRef(null);

  const restaurantList=[];
    const changeSearch = useCallback((event) => {
      let res= [...restaurantDetails];
      res.push(event);
      restaurantList.push(event);
    
      if (restaurantList.length >=9)
      {
        classRef.current.updateRestaurants(restaurantList);
        setRestaurantDetails(restaurantList);
      }

      
    })
    return (
      <div className="flex-container"><br/>
      <div className="flex-child">
      <Map
        onLoad={map => {
          const bounds = new window.google.maps.LatLngBounds();
          map.fitBounds(bounds);
        }}
        onUnmount={map => {
          // do your stuff before map is unmounted
        }}
        changeSearch={changeSearch}
        />
          </div>
          <div className="float-child">
        <DisplayRestaurants ref= {classRef} /></div>
      </div>
    );
};

export default MapLoader;