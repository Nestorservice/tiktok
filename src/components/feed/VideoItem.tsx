import React, { memo, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Video from 'react-native-video';
import { VideoWithAuthor } from '../../types';
import VideoActions from './VideoActions';
import VideoInfo from './VideoInfo';
import DoubleTapLike from './DoubleTapLike';
import { useDoubleTap } from '../../hooks/useDoubleTap';
import { useLike } from '../../hooks/useLike';
import { useAppDispatch } from '../../store/hooks';
import { setCommentSheetVideoId } from '../../store/slices/uiSlice';
import { useFollow } from '../../hooks/useFollow';
import Share from 'react-native-share';

import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface Props { video: VideoWithAuthor; isActive: boolean; isPausedGlobal: boolean; }

function VideoItem({ video, isActive, isPausedGlobal }: Props) {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { like } = useLike();
  const { follow } = useFollow();
  const [manualPause, setManualPause] = useState(false);
  const [heartVisible, setHeartVisible] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: width / 2, y: height / 2 });
  const isPaused = !isActive || isPausedGlobal || manualPause;

  const handleTap = useDoubleTap(
    useCallback(() => setManualPause(p => !p), []),
    useCallback(() => { if (!video.isLiked) like(video.videoId, false); setHeartVisible(true); }, [video.isLiked, video.videoId, like]),
  );

  const onProfilePress = useCallback(() => {
    navigation.navigate('UserProfile', { userId: video.author.uid });
  }, [navigation, video.author.uid]);

  return (
    <TouchableWithoutFeedback onPress={(e: any) => { setHeartPos({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }); handleTap(); }}>
      <View style={styles.container}>
        {isActive && <Video source={{ uri: video.videoUrl }} style={styles.video} resizeMode="cover" repeat paused={isPaused} ignoreSilentSwitch="obey" />}
        <VideoInfo video={video} onProfilePress={onProfilePress} />
        <VideoActions 
          video={video} 
          isPlaying={!isPaused} 
          onLike={() => like(video.videoId, video.isLiked)} 
          onComment={() => dispatch(setCommentSheetVideoId(video.videoId))} 
          onFollow={() => follow(video.author.uid, false)} 
          onShare={async () => { try { await Share.open({ url: video.videoUrl, title: video.description }); } catch {} }} 
          onProfilePress={onProfilePress}
        />
        <DoubleTapLike visible={heartVisible} x={heartPos.x} y={heartPos.y} onAnimationFinish={() => setHeartVisible(false)} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default memo(VideoItem);
const styles = StyleSheet.create({
  container: { width, height, backgroundColor: '#000' },
  video: { ...StyleSheet.absoluteFillObject },
});
