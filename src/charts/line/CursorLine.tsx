import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { LineChartDimensionsContext } from './Chart';
import { LineChartCursor, LineChartCursorProps } from './Cursor';
import { useLineChart } from './useLineChart';

type LineChartCursorLineProps = {
  children?: React.ReactNode;
  color?: string;
  isShowTooltip?: boolean;
} & Omit<LineChartCursorProps, 'type' | 'children'>;

LineChartCursorLine.displayName = 'LineChartCursorLine';

export function LineChartCursorLine({
  children,
  color = '#ED4DBC',
  isShowTooltip,
  ...cursorProps
}: LineChartCursorLineProps) {
  const { height } = React.useContext(LineChartDimensionsContext);
  const { currentX, isActive } = useLineChart();

  const vertical = useAnimatedStyle(
    () => ({
      opacity: isActive.value ? 1 : 0,
      height: '100%',
      transform: [{ translateX: currentX.value }],
    }),
    [currentX, isActive]
  );

  return (
    <LineChartCursor {...cursorProps} type="line" isShowTooltip={isShowTooltip}>
      <Animated.View style={vertical}>
        <View
          style={[styles.line, { height: height, backgroundColor: color }]}
        />
        <View style={[styles.bottomTooltip, { backgroundColor: color }]} />
      </Animated.View>
      {children}
    </LineChartCursor>
  );
}

const styles = StyleSheet.create({
  line: {
    width: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.8,
  },
  bottomTooltip: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'absolute',
    bottom: 0,
    left: -2,
    opacity: 1,
  },
});
