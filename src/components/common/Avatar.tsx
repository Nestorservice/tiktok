import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '../../theme';

interface Props { uri?: string | null; size?: number; }

export default function Avatar({ uri, size = 40 }: Props) {
  return <FastImage source={uri ? { uri } : undefined} style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]} />;
}

const styles = StyleSheet.create({ base: { backgroundColor: colors.surfaceLight } });
