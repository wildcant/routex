import type { LatLngExpression, PointExpression } from 'leaflet';

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
