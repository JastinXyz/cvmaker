import { Circle, Path, Svg } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

interface MaterialIconProps {
  icon: React.ElementType;
  size?: number;
  color?: string;
  style?: any;
}

export const MaterialIcon = ({ icon: Icon, size = 24, color = 'black', style }: MaterialIconProps) => {
  const [paths, setPaths] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Render the icon to a string
    const iconString = ReactDOMServer.renderToString(<Icon />);

    // Create a temporary DOM element to parse the string
    const parser = new DOMParser();
    const doc = parser.parseFromString(iconString, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (svgElement) {
      const svgPaths = Array.from(svgElement.querySelectorAll('path')).map((path, index) => (
        <Path key={index} d={path.getAttribute('d') || ''} fill={color} />
      ));
      const svgCircles = Array.from(svgElement.querySelectorAll('circle')).map((circle, index) => (
        <Circle
          key={index}
          cx={circle.getAttribute('cx') || ''}
          cy={circle.getAttribute('cy') || ''}
          r={circle.getAttribute('r') || ''}
          fill={color}
        />
      ));
      setPaths([...svgPaths, ...svgCircles]);
    }
  }, [Icon, color]);

  return (
    <Svg viewBox="0 0 24 24" style={{ ...style, width: size, height: size }}>
      {paths}
    </Svg>
  );
};