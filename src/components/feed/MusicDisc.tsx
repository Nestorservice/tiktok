import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '../../theme';
import { MUSIC_DISC_DURATION } from '../../utils/constants';

interface Props { thumbnailUrl: string; isPlaying: boolean; }

export default function MusicDisc({ thumbnailUrl, isPlaying }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const currentAngle = useRef(0);

  useEffect(() => {
    const id = rotation.addListener(({ value }) => { currentAngle.current = value; });
    return () => rotation.removeListener(id);
  }, [rotation]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = Animated.loop(Animated.timing(rotation, { toValue: currentAngle.current + 1, duration: MUSIC_DISC_DURATION, easing: Easing.linear, useNativeDriver: true }));
      animRef.current.start();
    } else { animRef.current?.stop(); }
  }, [isPlaying, rotation]);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={[styles.disc, { transform: [{ rotate: spin }] }]}>
      <FastImage source={thumbnailUrl ? { uri: thumbnailUrl } : require('../../assets/icons/disc.png')} style={styles.image} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  disc: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: colors.grayLight, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
});
