import * as React from "react"
import Map, {Marker} from 'react-map-gl';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import {useEffect} from "react";

import DeckGL from '@deck.gl/react';
import {MapController} from '@deck.gl/core';
import {ScenegraphLayer} from '@deck.gl/mesh-layers';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q'; // Set your mapbox token here
// styles
const pageStyles = {
    color: "#232129",
    padding: 96,
    fontFamily: "-apple-system, Roboto, sans-serif, serif",
}

const IndexPage = () => {
    const mapRef = React.useRef();

    useEffect(() => {
        // eslint-disable-next-line import/no-webpack-loader-syntax
        mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
        setTimeout(() => {
            console.log(mapRef.current)
        }, 5000)
    })

    const layer = new ScenegraphLayer({
        id: 'scenegraph-layer',
        name: 'Colma (COLM)',
        address: '365 D Street, Colma CA 94014',
        exits: 4214,
        coordinates: [-122.4, 37.8],
        pickable: true,
        scenegraph: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
        getPosition: d => d.coordinates,
        getOrientation: d => [0, Math.random() * 180, 90],
        _animations: {
            '*': {speed: 5}
        },
        sizeScale: 500,
        _lighting: 'pbr'
    });

  return (
    <main style={pageStyles}>
        <DeckGL
            height="100%"
            initialViewState={{
                latitude: 37.8,
                longitude: -122.4,
                zoom: 14
            }}
            controller={{type: MapController}}
            layers={[layer]}
        >
            <Map
              ref={mapRef}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              mapboxAccessToken={MAPBOX_TOKEN}
              preventStyleDiffing>

            </Map>
        </DeckGL>
    </main>
  )
}

export default IndexPage
