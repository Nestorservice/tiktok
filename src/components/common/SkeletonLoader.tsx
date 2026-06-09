import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme';

interface Props { width: number | string; height: number; borderRadius?: number; style?: ViewStyle; }

export default function SkeletonLoader({ width, height, borderRadius = 4, style }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
    ])).start();
  }, [opacity]);
  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: colors.surfaceLight }, { opacity }, style]} />;
}
