import { LineString, MultiPolygon, Polygon } from 'geojson';
import { Layer, Source, useMap } from 'react-map-gl/mapbox';

type Props = { shape?: Polygon | LineString | MultiPolygon };

const MarkerShape = ({ shape }: Props) => {
  const { current: mapRef } = useMap();
  const isMapReady = !!mapRef?.getMap?.();

  if (!shape || !isMapReady) return null;

  return (
    <Source id="site-boundary-source" type="geojson" data={shape}>
      <Layer
        id="site-boundary-fill-layer"
        type="fill"
        paint={{ 'fill-color': '#008EEC', 'fill-opacity': 0.15 }}
      />
      <Layer
        id="site-boundary-line-layer"
        type="line"
        paint={{ 'line-color': '#008EEC', 'line-width': 2 }}
      />
    </Source>
  );
};

export default MarkerShape;
