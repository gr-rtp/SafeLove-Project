//https://www.npmjs.com/package/@react-google-maps/api
import React, { useRef, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, LoadScript, places,StandaloneSearchBox } from '@react-google-maps/api';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
// import { useGeolocated } from "react-geolocated";
import DisplayRestaurants from './DisplayRestaurants';


const containerStyle = {
  width: '1200px',
  height: '900px'
};
var markerCluster;
var markers= [];

function MapComponent({changeSearch}) {

  const [map, setMap] = React.useState(null);
  const [center,setCenter] = useState({lat:0, lng:1});
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  const classRef = useRef(null);

    // const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    //         useGeolocated({
    //             positionOptions: {
    //                 enableHighAccuracy: false,
    //             },
    //             userDecisionTimeout: 5000,
    //         });
    
    const onLoad = React.useCallback(function callback(map) {
      
              const bounds = new window.google.maps.LatLngBounds(center);
              map.fitBounds(bounds);
              setMap(map)

        
    }, [map])
    const [places,setPlaces]=useState("");
    
  
    

    const handleLoad = ref =>{
      setPlaces(ref);
    };
  const handlePlacesChanged = () => {
    const google = window.google;
    const results=places.getPlaces();
    var service = new google.maps.places.PlacesService(map);
    var request = {
      location: results[0].geometry.location,
      radius: 5000,
      type: ['restaurant']
    }
    
    setCenter(results[0].geometry.location);
    service.nearbySearch(request,callback);
    
    
  };
  
  function callback(results, status) {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      // setMarkers([]);
      var tempArray=[];
      var tempRestaurants=[];
      results.forEach((result)=> {
        tempArray.push(result.geometry.location);
      });
      if(markers.length >0){

        
        markerCluster.removeMarkers(markers);
      }
      const google = window.google;
      var service = new google.maps.places.PlacesService(map);
      let placesInfo = [];
      let fields = ['name', 'formatted_address', 'formatted_phone_number', 'rating', 'user_ratings_total', 'reviews', 'photo', 'place_id', 'geometry'];
      results.map( place => {
         service.getDetails({placeId: place.place_id, fields}, function(placeInfo, status) {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {

            // Add New Place
              placesInfo.push(placeInfo);
              changeSearch(placeInfo);
          }
        })
      })
      
      
      markers= [];
      tempArray.forEach((location) => {
        markers.push(
          new window.google.maps.Marker({
            position: location,
            map
          })
        )
      });
      markerCluster =new MarkerClusterer({ markers, map });
   
    }
  }
  
    
   
  return  (
    <>
    <LoadScript id="script-loader" googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY} libraries={["places"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
      >
        <StandaloneSearchBox
          onLoad={handleLoad}
          onPlacesChanged={handlePlacesChanged}
          
        >
          <input
            type="text"
            placeholder="Enter Suburb"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px",
              backgroundColor: "white"
            }}
          />
        </StandaloneSearchBox>
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
      </LoadScript>
      </>)
  
}


export default React.memo(MapComponent)