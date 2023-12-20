import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line as SVGLine, Rect, Text } from 'react-native-svg';
import flattenChildren from 'react-keyed-flatten-children';

import { LineChartDimensionsContext } from './Chart';
import { LineChartPathContext } from './LineChartPathContext';
import { LineChartPath, LineChartPathProps } from './Path';
import type { WithTimingConfig } from 'react-native-reanimated';

const BACKGROUND_COMPONENTS = [
  'LineChartHighlight',
  'LineChartHorizontalLine',
  'LineChartGradient',
  'LineChartDot',
  'LineChartTooltip',
];

type LineChartPathWrapperProps = {
  animationDuration?: number;
  animationProps?: Omit<Partial<WithTimingConfig>, 'duration'>;
  children?: React.ReactNode;
  color?: string;
  inactiveColor?: string;
  width?: number;
  widthOffset?: number;
  pathProps?: Partial<LineChartPathProps>;
  showInactivePath?: boolean;
  animateOnMount?: 'foreground';
  mountAnimationDuration?: number;
  mountAnimationProps?: Partial<WithTimingConfig>;
  showYAxis?: boolean;
  yAxisProps?: {
    yGutter?: number;
    yLineNumber?: number;
    maxValue?: number;
    dashColor?: string;
    textColor?: string;
    textBackgroundColor?: string;
    formatYLabel?: (value: number) => string;
  };
};

LineChartPathWrapper.displayName = 'LineChartPathWrapper';

export function LineChartPathWrapper({
  children,
  color = 'black',
  inactiveColor,
  width: strokeWidth = 3,
  pathProps = {},
  showInactivePath = true,
  showYAxis = false,
  yAxisProps = {},
}: LineChartPathWrapperProps) {
  const { height, width } = React.useContext(LineChartDimensionsContext);

  ////////////////////////////////////////////////

  const viewSize = React.useMemo(() => ({ width, height }), [width, height]);

  ////////////////////////////////////////////////

  let backgroundChildren;
  if (children) {
    const iterableChildren = flattenChildren(children);
    backgroundChildren = iterableChildren.filter((child) =>
      // @ts-ignore
      BACKGROUND_COMPONENTS.includes(child?.type?.displayName)
    );
  }

  ////////////////////////////////////////////////

  const yGutter = yAxisProps.yGutter ?? 16;
  const yLineNumber = yAxisProps.yLineNumber ?? 4;
  const maxValue = yAxisProps.maxValue ?? 100;
  const dashColor = yAxisProps.dashColor ?? '#C9C9C9';
  const textColor = yAxisProps.textColor ?? '#000000';
  const textBackgroundColor = yAxisProps.textBackgroundColor ?? '#FFFFFF';

  const zeroPointHeight = height - yGutter * 2;
  const yLine = zeroPointHeight / yLineNumber;

  const yValue = [...Array(yLineNumber + 1)].map((_, i) => {
    return yAxisProps.formatYLabel
      ? yAxisProps.formatYLabel((maxValue / yLineNumber) * i)
      : Math.round((maxValue / yLineNumber) * i);
  });

  return (
    <>
      {showYAxis && (
        <Svg style={styles.svg}>
          {[...Array(yLineNumber + 1)].map((_, i) => {
            const y = zeroPointHeight - yLine * i + yGutter;
            return (
              <React.Fragment key={i}>
                <SVGLine
                  x1={0}
                  y1={y}
                  x2={width}
                  y2={y}
                  strokeWidth={2}
                  stroke={dashColor}
                  strokeDasharray="2 6"
                />
              </React.Fragment>
            );
          })}
        </Svg>
      )}
      <LineChartPathContext.Provider
        value={{
          color,
          isInactive: showInactivePath,
          isTransitionEnabled: pathProps.isTransitionEnabled ?? true,
        }}
      >
        <View style={viewSize}>
          <Svg width={width} height={height}>
            <LineChartPath
              color={color}
              inactiveColor={inactiveColor}
              width={strokeWidth}
              {...pathProps}
            />
            {backgroundChildren}
          </Svg>
        </View>
      </LineChartPathContext.Provider>
      {showYAxis && (
        <Svg style={styles.svg}>
          {[...Array(yLineNumber + 1)].map((_, i) => {
            const y = zeroPointHeight - yLine * i + yGutter;
            const width = yValue[i].toString().length;
            return (
              <React.Fragment key={i}>
                <Rect
                  x={0}
                  y={y - 7}
                  width={
                    width > 3
                      ? 26
                      : width > 2
                      ? 20
                      : width > 1
                      ? 16
                      : width > 0
                      ? 9
                      : 0
                  }
                  height={14}
                  fill={textBackgroundColor}
                  rx={3}
                  ry={3}
                />
                <Text x={1} y={y + 3.5} fontSize={10} fill={textColor}>
                  {yValue[i]}
                </Text>
              </React.Fragment>
            );
          })}
        </Svg>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  svg: {
    ...StyleSheet.absoluteFillObject,
    // height: 100% is required for <svg /> on web
    height: '100%',
  },
});
