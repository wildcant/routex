import type L from 'leaflet';
import { nanoid } from 'nanoid';
import { transmissionLines } from './stores';
import type { ExtendedLine, ExtendedPole } from './types';

export function addPole(
  position: L.LatLngLiteral,
  previosPole: ExtendedPole,
  transmissionLineId: string
) {
  const newPole: ExtendedPole = {
    id: nanoid(11),
    lat: position.lat,
    lng: position.lng,
    transmissionLineId
  };
  const newLine: ExtendedLine = {
    id: nanoid(11),
    start: previosPole,
    end: newPole,
    startPoleId: previosPole.id,
    endPoleId: newPole.id,
    transmissionLineId
  };

  transmissionLines.update((currentTransmissionLines) =>
    currentTransmissionLines.map((transmissionLine) => {
      if (transmissionLine.id !== transmissionLineId) return transmissionLine;

      return {
        ...transmissionLine,
        poles: transmissionLine.poles.concat(newPole),
        lines: transmissionLine.lines.concat(newLine)
      };
    })
  );

  return { newPole, newLine };
}
