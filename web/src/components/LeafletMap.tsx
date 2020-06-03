import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker/*, Popup*/ } from 'react-leaflet';

export interface LeafletMapProps {
    markerPosition: [number, number];
    onClick: Function;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ onClick, markerPosition }) => {

    const [getInitialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

    useEffect( () => {

        navigator.geolocation.getCurrentPosition( (position) => {

            setInitialPosition([position.coords.latitude, position.coords.longitude]);
        });

    }, [])

    return (
        <Map center={getInitialPosition} zoom={15} onclick={(event) => onClick(event)} >
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={markerPosition}>
                {/*<Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>*/}
            </Marker>
        </Map>
    );
}

export default LeafletMap;