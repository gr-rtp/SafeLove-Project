

import React, { useEffect, useRef, useCallback } from 'react'

const SearchBox = ({ maps, onPlacesChanged, placeholder }) => {
    const input = useRef(null);
    const searchBox = useRef(null);

    const handleOnPlacesChanged = useCallback(() => {
        if (onPlacesChanged) {
            onPlacesChanged(searchBox.current.getPlaces());
        }
    }, [onPlacesChanged, searchBox]);

    useEffect(() => {
        if (!searchBox.current && maps) {
            searchBox.current = new maps.places.SearchBox(input.current);
            searchBox.current.addListener('places_changed', handleOnPlacesChanged);
        }

        return () => {
            if (maps) {
                searchBox.current = null;
                maps.event.clearInstanceListeners(searchBox);
            }
        };
    }, [maps, handleOnPlacesChanged]);
  return (
    <div style={{position: "absolute"}}><input ref={input} placeholder={placeholder} type="text" />;</div>
  )
}

export default SearchBox