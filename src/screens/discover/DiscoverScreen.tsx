import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import SearchBar from '../../components/discover/SearchBar';
import TrendingHashtags from '../../components/discover/TrendingHashtags';
import VideoGrid from '../../components/discover/VideoGrid';
import { searchVideos } from '../../services/firebase/videos.service';
import { Video } from '../../types';

import { EMPTY_STATES } from '../../utils/constants';

export default function DiscoverScreen() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setVideos([]); return; }
    setIsLoading(true);
    setError(null);
    try { setVideos(await searchVideos(q.trim())); }
    catch { setError("Une erreur est survenue lors de la recherche"); }
    finally { setIsLoading(false); }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Découvrir</Text>
      <SearchBar value={query} onChangeText={setQuery} onSubmit={() => doSearch(query)} />
      {!query && <><Text style={styles.section}>Tendances</Text><TrendingHashtags onSelect={tag => { setQuery(tag); doSearch(tag); }} /></>}
      {isLoading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : 
       error ? <View style={styles.empty}><Text style={styles.errorText}>{error}</Text></View> :
       videos.length > 0 ? <VideoGrid videos={videos} onPress={() => {}} /> : 
       query ? <View style={styles.empty}><Text style={styles.emptyText}>{EMPTY_STATES.discover} pour "{query}"</Text></View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.white, fontWeight: typography.bold, fontSize: 18, textAlign: 'center', paddingVertical: spacing.md },
  section: { color: colors.white, fontWeight: typography.bold, fontSize: typography.lg, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  loader: { marginTop: spacing.xxxl },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.gray },
  errorText: { color: colors.primary, textAlign: 'center' },
});
