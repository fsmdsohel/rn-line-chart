import * as React from 'react';
import Animated from 'react-native-reanimated';
import { Defs, LinearGradient, Path, PathProps, Stop } from 'react-native-svg';

import { LineChartDimensionsContext } from './Chart';
import { LineChartPathContext } from './LineChartPathContext';
import useAnimatedPath from './useAnimatedPath';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type LineChartPathProps = Animated.AnimateProps<PathProps> & {
  color?: string;
  inactiveColor?: string;
  width?: number;
  isInactive?: boolean;
  /**
   * Default: `true`.
   *
   * If `false`, changes in the chart's path will not animate.
   *
   * While this use case is rare, it may be useful on web, where animations might not work as well.
   *
   * **Example**
   *
   * ```tsx
   * <LineChart.Path
   *   pathProps={{ isTransitionEnabled: Platform.OS !== 'web' }}
   * />
   * ```
   */
  isTransitionEnabled?: boolean;
  threshold?: Array<{
    value: number;
    color: string;
  }>;
};

LineChartPath.displayName = 'LineChartPath';

export function LineChartPath({
  color = 'black',
  inactiveColor,
  width: strokeWidth = 3,
  threshold = [],
  ...props
}: LineChartPathProps) {
  const { path } = React.useContext(LineChartDimensionsContext);
  const { isTransitionEnabled, isInactive } =
    React.useContext(LineChartPathContext);

  ////////////////////////////////////////////////

  const { animatedProps } = useAnimatedPath({
    enabled: isTransitionEnabled,
    path,
  });

  ////////////////////////////////////////////////

  return (
    <>
      <Defs>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          {threshold.map((item, index) => {
            return (
              <Stop
                key={index}
                offset={item.value + '%'}
                stopColor={item.color}
              />
            );
          })}
        </LinearGradient>
      </Defs>
      <AnimatedPath
        animatedProps={animatedProps}
        fill="transparent"
        stroke={
          threshold.length
            ? 'url(#gradient)'
            : isInactive
            ? inactiveColor || color
            : color
        }
        // strokeOpacity={isInactive && !inactiveColor ? 0.2 : 1}
        strokeOpacity={1}
        strokeWidth={strokeWidth}
        {...props}
      />
    </>
  );
}
