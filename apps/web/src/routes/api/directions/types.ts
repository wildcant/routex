export type GoogleDirectionsApiResponse = {
  geocoded_waypoints: GeocodedWaypoint[];
  routes: Route[];
  status: string;
};

type GeocodedWaypoint = {
  geocoder_status: string;
  place_id: string;
  types: string[];
};

type Route = {
  bounds: Bounds;
  copyrights: string;
  legs: Leg[];
  overview_polyline: OverviewPolyline;
  summary: string;
  warnings: any[];
  waypoint_order: any[];
};

type Bounds = {
  northeast: Northeast;
  southwest: Southwest;
};

type Northeast = {
  lat: number;
  lng: number;
};

type Southwest = {
  lat: number;
  lng: number;
};

type Leg = {
  distance: Distance;
  duration: Duration;
  end_address: string;
  end_location: EndLocation;
  start_address: string;
  start_location: StartLocation;
  steps: Step[];
  traffic_speed_entry: any[];
  via_waypoint: any[];
};

type Distance = {
  text: string;
  value: number;
};

type Duration = {
  text: string;
  value: number;
};

type EndLocation = {
  lat: number;
  lng: number;
};

type StartLocation = {
  lat: number;
  lng: number;
};

type Step = {
  distance: Distance2;
  duration: Duration2;
  end_location: EndLocation2;
  html_instructions: string;
  polyline: Polyline;
  start_location: StartLocation2;
  travel_mode: string;
  maneuver?: string;
};

type Distance2 = {
  text: string;
  value: number;
};

type Duration2 = {
  text: string;
  value: number;
};

type EndLocation2 = {
  lat: number;
  lng: number;
};

type Polyline = {
  points: string;
};

type StartLocation2 = {
  lat: number;
  lng: number;
};

type OverviewPolyline = {
  points: string;
};
