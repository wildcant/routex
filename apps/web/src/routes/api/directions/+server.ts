import { GOOGLE_MAPS_API } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { GoogleDirectionsApiResponse } from './types';

export const GET: RequestHandler = async ({ url }) => {
  const destination = url.searchParams.get('destination');
  const origin = url.searchParams.get('origin');
  if (!destination) throw error(403, { message: 'Destination param is required' });
  if (!origin) throw error(403, { message: 'Origin param is required' });

  const results = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?destination=${destination}&origin=${origin}&mode=walking&key=${GOOGLE_MAPS_API}`
  );
  const data = (await results.json()) as GoogleDirectionsApiResponse;

  return new Response(
    JSON.stringify({ success: true, polylineEncoded: data.routes[0].overview_polyline.points })
  );
};
