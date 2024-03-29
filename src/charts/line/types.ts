import type Animated from 'react-native-reanimated';

export type TLineChartPoint = {
  timestamp: number;
  value: number;
};
export type TLineChartDataProp =
  | TLineChartData
  | {
      [key: string]: TLineChartData;
    };
export type TLineChartData = Array<TLineChartPoint>;
export type TLineChartDomain = [number, number];
export type TLineChartContext = {
  currentX: Animated.SharedValue<number>;
  currentIndex: Animated.SharedValue<number>;
  isActive: Animated.SharedValue<boolean>;
  domain: TLineChartDomain;
  yDomain: YDomain;
  xLength: number;
  xDomain?: [number, number] | undefined;
  scale: Animated.SharedValue<number>;
};

export type YRangeProp = {
  min?: number;
  max?: number;
};

export type YDomain = {
  min: number;
  max: number;
};

export type TFormatterFn<T> = ({
  value,
  formatted,
}: {
  value: T;
  formatted: string;
}) => string;
