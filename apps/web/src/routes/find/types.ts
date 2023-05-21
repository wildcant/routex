import type { TransmissionLine as DTransmissionLine } from 'database/client';
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import type { Prettify } from '../../types';

export type TransmissionLine = Prettify<
  Omit<DTransmissionLine, 'geojson'> & {
    geojson: FeatureCollection<Geometry, GeoJsonProperties>;
  }
>;
