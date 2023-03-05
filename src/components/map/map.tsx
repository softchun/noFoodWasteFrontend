import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { icon } from 'leaflet';

// const position = [13.869420810923787, 100.51786976168559]
const position = {
    lat: 13.869420810923787,
    lng: 100.51786976168559
}

const ICON = icon({
    iconUrl: '/images/marker-icon.svg',
    iconSize: [36, 36],
})

type Props = {
    data?: any,
    storeName?: string,
}

function Map({ data, storeName }: Props) {
    return (
            <MapContainer center={data && data?.lat && data?.lng ? data : position} zoom={18} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={data && data?.lat && data?.lng ? data : position} icon={ICON}>
                    <Popup>
                        {storeName || 'Store'}
                    </Popup>
                </Marker>
            </MapContainer>
    )
}

export default Map