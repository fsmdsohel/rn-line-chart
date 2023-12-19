import * as React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { LineChartCursor, LineChartCursorProps } from './Cursor';
import { useLineChart } from './useLineChart';

type LineChartCursorCrosshairProps = Omit<
  LineChartCursorProps,
  'children' | 'type'
> & {
  children?: React.ReactNode;
  color?: string;
  size?: number;
  outerSize?: number;
  crosshairWrapperProps?: Animated.AnimateProps<ViewProps>;
  crosshairProps?: ViewProps;
  crosshairOuterProps?: ViewProps;
};

LineChartCursorCrosshair.displayName = 'LineChartCursorCrosshair';

export function LineChartCursorCrosshair({
  children,
  color = '#754EF6',
  size = 8,
  outerSize = 16,
  crosshairWrapperProps = {},
  crosshairProps = {},
  crosshairOuterProps = {},
  ...props
}: LineChartCursorCrosshairProps) {
  const { currentX, currentY, isActive } = useLineChart();

  // It seems that enabling spring animation on initial render on Android causes a crash.
  const [enableSpringAnimation, setEnableSpringAnimation] = React.useState(
    Platform.OS === 'ios'
  );
  React.useEffect(() => {
    setTimeout(() => {
      setEnableSpringAnimation(true);
    }, 100);
  }, []);

  const animatedCursorStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateX: currentX.value - outerSize / 2 },
        { translateY: currentY.value - outerSize / 2 },
        {
          scale: enableSpringAnimation
            ? withSpring(isActive.value ? 1 : 0, {
                damping: 10,
              })
            : 0,
        },
      ],
    }),
    [currentX, currentY, enableSpringAnimation, isActive, outerSize]
  );

  return (
    <LineChartCursor type="crosshair" {...props}>
      {children}
      <Animated.View
        {...crosshairWrapperProps}
        style={[
          {
            width: outerSize,
            height: outerSize,
          },
          styles.container,
          animatedCursorStyle,
          crosshairWrapperProps.style,
        ]}
      >
        <View
          {...crosshairOuterProps}
          style={[
            { width: outerSize, height: outerSize, borderRadius: outerSize },
            styles.outer,
            crosshairOuterProps.style,
          ]}
        />
        <View
          {...crosshairProps}
          style={[
            {
              width: size,
              height: size,
              borderRadius: size,
              backgroundColor: color,
            },
            crosshairProps.style,
          ]}
        />
      </Animated.View>
    </LineChartCursor>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    // shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1.51,
    elevation: 2,
  },
});
