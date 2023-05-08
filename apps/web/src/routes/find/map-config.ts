import type { LatLngExpression, PointExpression } from 'leaflet';
import type { FeatureCollection } from 'geojson';

export const assets = {
  icons: {
    pole: {
      url: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI5LjMzNCAyOS4zMzQiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTE0LjY2NiwwQzYuNTc4LDAsMCw2LjU4LDAsMTQuNjY3czYuNTc4LDE0LjY2NywxNC42NjYsMTQuNjY3czE0LjY2OC02LjU4LDE0LjY2OC0xNC42NjdTMjIuNzU0LDAsMTQuNjY2LDB6DQoJCSBNMTQuNjY2LDI1LjMzNEM4Ljc4NCwyNS4zMzQsNCwyMC41NDksNCwxNC42NjdTOC43ODQsNCwxNC42NjYsNGM1Ljg4MywwLDEwLjY2OCw0Ljc4NSwxMC42NjgsMTAuNjY3UzIwLjU0NywyNS4zMzQsMTQuNjY2LDI1LjMzNA0KCQl6IE0xOS4zMzIsMTQuNjY3YzAsMi41NzctMi4wODksNC42NjctNC42NjYsNC42NjdjLTIuNTc2LDAtNC42NjYtMi4wODktNC42NjYtNC42NjdDMTAsMTIuMDksMTIuMDksMTAsMTQuNjY2LDEwDQoJCUMxNy4yNDMsMTAsMTkuMzMyLDEyLjA5LDE5LjMzMiwxNC42Njd6Ii8+DQo8L2c+DQo8L3N2Zz4=',
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

export const sampleLines: FeatureCollection[] = [
  {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          color: 'black'
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
  }
];
