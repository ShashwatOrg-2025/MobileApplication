import React from 'react';
import { Polygon } from 'react-native-maps';
import { getGridBounds } from '../../utils/mapUtils';

const GridOverlay = ({ gridKey }) => {
  const bounds = getGridBounds(gridKey);
  
  const coordinates = [
    { latitude: bounds.north, longitude: bounds.west },
    { latitude: bounds.north, longitude: bounds.east },
    { latitude: bounds.south, longitude: bounds.east },
    { latitude: bounds.south, longitude: bounds.west },
  ];

  return (
    <Polygon
      coordinates={coordinates}
      strokeColor="rgba(0, 0, 255, 0.5)"
      strokeWidth={1}
      fillColor="transparent"
    />
  );
};

export default GridOverlay;