import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, typography, spacing } from '../../theme';
import { useUpload } from '../../hooks/useUpload';

type RouteParams = { Post: { videoUri: string; duration: number } };

export default function PostScreen() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteProp<RouteParams, 'Post'>>();
  const { upload, progress, isUploading, error } = useUpload();
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');

  async function handlePost() {
    const success = await upload({ localUri: params.videoUri, description, hashtags: hashtags.split(/[\s,]+/).map(t => t.replace(/^#/, '').trim()).filter(Boolean), musicName: '', duration: params.duration, thumbnailUrl: '' });
    if (success) navigation.navigate('Home');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
          <Text style={styles.title}>Nouvelle publication</Text>
          <View style={{ width: 24 }} />
        </View>
        <Video source={{ uri: params.videoUri }} style={styles.preview} repeat muted paused={isUploading} resizeMode="cover" />
        <TextInput style={styles.input} placeholder="Décris ta vidéo..." placeholderTextColor={colors.gray} value={description} onChangeText={setDescription} multiline maxLength={150} />
        <TextInput style={styles.input} placeholder="#hashtags séparés par des espaces" placeholderTextColor={colors.gray} value={hashtags} onChangeText={setHashtags} autoCapitalize="none" />
        {error && <Text style={styles.error}>{error}</Text>}
        {isUploading && <View style={styles.progressBg}><View style={[styles.progressBar, { width: `${progress}%` }]} /></View>}
        <TouchableOpacity style={[styles.postBtn, isUploading && styles.postDisabled]} onPress={handlePost} disabled={isUploading} activeOpacity={0.8}>
          {isUploading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.postBtnText}>Publier</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  back: { color: colors.white, fontSize: 22 },
  title: { color: colors.white, fontWeight: typography.bold, fontSize: typography.lg },
  preview: { width: '100%', aspectRatio: 9 / 16, borderRadius: 8, marginBottom: spacing.lg, backgroundColor: colors.surfaceLight },
  input: { backgroundColor: colors.surfaceLight, color: colors.white, borderRadius: 8, padding: spacing.md, fontSize: typography.base, marginBottom: spacing.md, minHeight: 50 },
  error: { color: colors.primary, fontSize: typography.sm, marginBottom: spacing.md },
  progressBg: { height: 4, backgroundColor: colors.surfaceLight, borderRadius: 2, marginBottom: spacing.md, overflow: 'hidden' },
  progressBar: { height: 4, backgroundColor: colors.primary },
  postBtn: { backgroundColor: colors.primary, height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: spacing.md },
  postDisabled: { opacity: 0.5 },
  postBtnText: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
});
