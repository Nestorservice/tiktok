import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface Props { visible: boolean; x: number; y: number; onAnimationFinish: () => void; }

export default function DoubleTapLike({ visible, x, y, onAnimationFinish }: Props) {
  if (!visible) return null;
  return (
    <View style={[styles.container, { left: x - 75, top: y - 75 }]} pointerEvents="none">
      <LottieView source={require('../../assets/animations/heart.json')} autoPlay loop={false} style={styles.lottie} onAnimationFinish={onAnimationFinish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', width: 150, height: 150, zIndex: 999 },
  lottie: { width: 150, height: 150 },
});
