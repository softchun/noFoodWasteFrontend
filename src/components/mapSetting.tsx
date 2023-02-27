import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { icon } from 'leaflet';
import { useState } from 'react';

// const position = [13.869420810923787, 100.51786976168559]
// const positionInit = {
//     lat: 13.869420810923787,
//     lng: 100.51786976168559
// }

const positionInit = {lat: 13.846432943388642, lng: 100.56985012110151}

const ICON = icon({
    iconUrl: '/images/shop-icon.svg',
    iconSize: [32, 32],
})

type PositionData = {
    lat: number,
    lng: number
}
type Props = {
    position?: PositionData,
    setPosition: any
}


function MapSetting({ position, setPosition }: Props) {

    // const [position2, setPosition2] = useState<PositionData>(position)
    function LocationMarker({center}: {center: PositionData}) {
        const [position2, setPosition2] = useState<PositionData>(center)
        const map = useMapEvents({
            click(e) {
                console.log(e)
                // map.locate()
                setPosition2(e.latlng)
                map.flyTo(e.latlng, map.getZoom())
                console.log('e', e.latlng)
                setPosition(e.latlng)
            },
            // locationfound(e) {
            //     setPosition(e.latlng)
            //     map.flyTo(e.latlng, map.getZoom())
            // },
        })

        return position2 === null ? null : (
            <Marker position={position2} icon={ICON}>
                <Popup>You are here</Popup>
            </Marker>
        )
    }

    console.log('latlng', position)
    return (
        <MapContainer center={positionInit} zoom={18} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <Marker position={position} icon={ICON}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker> */}
            <LocationMarker center={positionInit} />
        </MapContainer>
    )
}

export default MapSetting