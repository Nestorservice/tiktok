import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';

interface Props { name: string; focused: boolean; size?: number; }

export default function TabBarIcon({ name, focused, size = 26 }: Props) {
  return <Ionicons name={focused ? name : `${name}-outline`} size={size} color={focused ? colors.white : colors.gray} />;
}
