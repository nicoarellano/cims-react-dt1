import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './component/Map.css'
//Completely unnecessary but I was able to make a location distane calibration function to aid wirh distances to buildings
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9oaXRpaWMiLCJhIjoiY2t2eGkyanJ3Y2c2azMwczdtOGppa3N5ZyJ9.G4VtowYp1GEpWxvh3nRFVQ';
//Brand new specialized mapbox token need for this to render the viewer

const App = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-75.6980);
  const [lat, setLat] = useState(45.3876);
  //Carleton Coordinates
  const [zoom, setZoom] = useState(12);
  const start = [lng, lat];

  useEffect(() => {
    if (map.current) return; // instantiate the map 1 time
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',// Street Bird's eye view  mapbox://styles/mapbox/streets-v11
      center: [lng, lat],
      zoom: zoom
    });
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    route();

  }, [map.current]);

  const locate = () => {
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        style: {
          right: 10,
          top: 10
        },
        position: 'bottom-left',
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
    );
  }

  const route = () => {
    locate();
    map.current.on('load', () => {
      // this is intended to display the first open world view from the Geogratis extention we had
      map.current.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: start
                }
              }
            ]
          }
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#3887be'
        }
      });

      map.current.on('click', (event) => {
        const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
        const end = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coords
              }
            }
          ]
        };
        if (map.current.getLayer('end')) {
          map.current.getSource('end').setData(end);
        } else {
          map.current.addLayer({
            id: 'end',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'Point',
                      coordinates: coords
                    }
                  }
                ]
              }
            },
            paint: {
              'circle-radius': 10,
              'circle-color': '#f30'
            }
          });
        }
        getRoute(coords);
      });
    });
  }

  async function getRoute(end) {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    if (map.current.getSource('route')) {
      map.current.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
    // get the sidebar and add the instructions
    const instructions = document.getElementById('instructions');
    const steps = data.legs[0].steps;

    let tripInstructions = '';
    for (const step of steps) {
      tripInstructions += `<li>${step.maneuver.instruction}</li>`;
    }
    instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
      data.duration / 60
    )} min</strong></p><ol>${tripInstructions}</ol>`;
  }

  return (
    <>
      <div ref={mapContainer} className="map-container" />
      <div id="instructions" className="instructions"></div>
    </>
  );
};

export default App;