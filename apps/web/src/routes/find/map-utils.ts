import type { Feature, LineString, Point, Position } from 'geojson';
import { transmissionLines } from './stores';

export function addPole(
  position: Position,
  previosPolePosition: Position,
  transmissionLineId: string
) {
  transmissionLines.update((currentTransmissionLines) =>
    currentTransmissionLines.map((transmissionLine) => {
      if (transmissionLine.id !== transmissionLineId) return transmissionLine;
      const features = transmissionLine.geojson.features;
      const newPole: Feature<Point> = {
        id: (features[features.length - 1].id as number) + 1,
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: position
        }
      };
      const newLine: Feature<LineString> = {
        id: (features[features.length - 1].id as number) + 2,
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [previosPolePosition, position]
        }
      };
      return {
        ...transmissionLine,
        geojson: {
          ...transmissionLine.geojson,
          features: [...features, newPole, newLine]
        }
      };
    })
  );
}
