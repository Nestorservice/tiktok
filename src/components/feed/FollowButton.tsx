import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, typography } from '../../theme';

interface Props { isFollowing: boolean; onPress: () => void; }

export default function FollowButton({ isFollowing, onPress }: Props) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  if (isFollowing) return null;
  return (
    <Animated.View style={[styles.container, animStyle]}>
      <TouchableOpacity onPress={() => { scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); }); onPress(); }} activeOpacity={1}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: -8, alignSelf: 'center', width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  plus: { color: colors.white, fontSize: 14, fontWeight: typography.bold, lineHeight: 18 },
});
