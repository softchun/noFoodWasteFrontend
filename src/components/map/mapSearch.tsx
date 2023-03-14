import React, { useEffect } from "react";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import { useMap } from "react-leaflet";

function MapSearch() {
    
    const prov = new OpenStreetMapProvider();

    const SearchControl = (props: any) => {
        const map = useMap();
      
        useEffect(() => {
            const searchControl = GeoSearchControl({
                provider: props.provider,
                ...props,
                // style: 'bar',
                // position: 'topright',
                // showMarker: false,
                // showPopup: false,
                // autoClose: false,
                // retainZoomLevel: false,
                // animateZoom: true,
                // keepResult: false,
                // searchLabel: 'Enter Address',
            });
        
            map.addControl(searchControl);
            return () => {map.removeControl(searchControl)};
        }, [props, map]);
      
        return null;
    };
    
    return (
        <SearchControl
            provider={prov}
            showMarker={true}
            showPopup={false}
            popupFormat={({ query, result }) => result.label}
            maxMarkers={1}
            retainZoomLevel={false}
            animateZoom={true}
            autoClose={false}
            searchLabel={"Enter address, please"}
            keepResult={true}
        />
    )
}

export default MapSearch;