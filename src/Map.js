import React, { useRef, useEffect, useState } from 'react';
// import ReactMapGl, {Marker} from React-Map-Global;
import mapboxgl from 'mapbox-gl';
import './component/Map.css'

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9oaXRpaWMiLCJhIjoiY2t2eGkyanJ3Y2c2azMwczdtOGppa3N5ZyJ9.G4VtowYp1GEpWxvh3nRFVQ'

export const Map = () => {
    const mapContainer = useRef()

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v10',// Street Bird's eye view mapbox://styles/mapbox/satellite-streets-v11 mapbox://styles/mapbox/streets-v11 mapbox://styles/mapbox/light-v10
            center: [-75.6980, 45.3876],
            zoom: 12
        })

        map.on("load", () => {
            map.addSource("mapbox-dem", {
                type: "raster-dem",
                url: "mapbox://mapbox-terrain-dem-v1",
                titleSize: 512,
                maxZoom: 16,
            })
            map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 })
            map.addLayer({
                id: "sky",
                type: "sky",
                paint: {
                    "sky-type": "atmosphere",
                    "sky-atmospehere-sun": [0.0, 90.0],
                    "sky-atmosphere-sun-intensity": 12,
                },
            })

        })

    }, [])

    return (
        <div
            id="map"
            ref={mapContainer}
            style={{ width: "100%", height: "100vh" }} />
    )

};
export default Map;