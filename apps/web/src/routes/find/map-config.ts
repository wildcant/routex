import type { LatLngExpression, PointExpression } from 'leaflet';
import type { TransmissionLine } from './types';

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const poleIconUrl = (color: string) => `
<svg
  fill="#000000"
  version="1.1"
  id="Capa_1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="800px"
  height="800px"
  viewBox="0 0 29.334 29.334"
  xml:space="preserve"
  >
  <g>
    <path
      fill="${color}"
      d="M14.666,0C6.578,0,0,6.58,0,14.667s6.578,14.667,14.666,14.667s14.668-6.58,14.668-14.667S22.754,0,14.666,0z
  M14.666,25.334C8.784,25.334,4,20.549,4,14.667S8.784,4,14.666,4c5.883,0,10.668,4.785,10.668,10.667S20.547,25.334,14.666,25.334
  z M19.332,14.667c0,2.577-2.089,4.667-4.666,4.667c-2.576,0-4.666-2.089-4.666-4.667C10,12.09,12.09,10,14.666,10
  C17.243,10,19.332,12.09,19.332,14.667z"
    />
  </g>
</svg>
`;

export const assets = {
  icons: {
    pole: {
      url: (color: string) => `data:image/svg+xml;base64,${window.btoa(poleIconUrl(color))}`,
      size: [16, 16] as PointExpression
    }
  }
};

export const config = {
  center: [11.195326, -74.222521] as LatLngExpression,
  zoom: 17,
  tiles: {
    openStreet: {
      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    },
    carto: {
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      options: {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }
    },
    google: {
      urlTemplate: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      options: {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    }
  }
};

export const sampleTransmissionLines: TransmissionLine[] = [
  {
    id: '1',
    geojson: {
      type: 'FeatureCollection',
      features: [
        {
          id: 1,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-74.219009, 11.194263],
              [-74.219052, 11.194895]
            ]
          }
        },
        {
          id: 2,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-74.219052, 11.194895]
          }
        },
        {
          id: 3,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-74.219052, 11.194895],
              [-74.21859, 11.19501]
            ]
          }
        },
        {
          id: 4,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-74.21859, 11.19501]
          }
        },
        {
          id: 5,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-74.21859, 11.19501],
              [-74.217936, 11.195052]
            ]
          }
        },
        {
          id: 6,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-74.217936, 11.195052]
          }
        }
      ]
    },
    color: '#2EC1B8'
  },
  {
    id: '2',
    geojson: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            color: '#5EEC92'
          },
          geometry: {
            coordinates: [
              [-74.22328611489122, 11.19293010016898],
              [-74.22239697488763, 11.193026345976548],
              [-74.22243376688716, 11.193483513125045],
              [-74.22185122688508, 11.193531635940474],
              [-74.22203518688602, 11.194548228553344],
              [-74.22144733167724, 11.194587808797351],
              [-74.22147799167739, 11.195261524919488],
              [-74.22001244367107, 11.195399877143117]
            ],
            type: 'LineString'
          }
        }
      ]
    },
    color: '#5EEC92'
  }
];
