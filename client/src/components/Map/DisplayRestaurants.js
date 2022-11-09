import React, {useState,useEffect, forwardRef, useImperativeHandle } from 'react'
import './style.css';

const DisplayRestaurants = forwardRef(({}, ref) => {
    const [details, setDetails] = useState([]);

    useImperativeHandle(ref, () => ({
        updateRestaurants(placeInfo){
            let newDetails= [...details];
            newDetails=  placeInfo;
            setDetails(newDetails);
        }
    }))
  
  return (
    <div className="sidebar">
    <div className="places">
        {
            details.map((place, index) => (
                <div className="place" key={index}>
                    <img className="image" src={place.photos ? place.photos[0].getUrl({maxWidth: 300, maxHeight: 300}) : 'https://via.placeholder.com/300'} alt={place.name} />
                    <div className="details">
                        <h2 className="name">{place.name}</h2>
                        <div className="review">
                            <ul className={'stars rate-' + Math.round(place.rating)}>
                            {Array( Math.round(place.rating)).fill(null).map((value,index) => (
                                <i className="fas fa-star" key={index}></i>

                            ))}
                    
                                
                            </ul>
                            <strong>{Math.round(place.rating)}</strong>
                            <span className="all-reviews" >({place.user_ratings_total})</span> 
                            
                        </div>
                        <ul className="info">
                            <li><i className="fas fa-phone-alt"></i><a href={'tel:' + place.formatted_phone_number}>{place.formatted_phone_number}</a></li>
                            <li><i className="fas fa-map-marker-alt"></i> {place.formatted_address}</li>
                        </ul>
                    </div>
                </div>
            ))
        }
    </div>
    </div>
  )
})

export default DisplayRestaurants