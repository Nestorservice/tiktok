import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAppDispatch } from '../../store/hooks';
import { clearCommentSheet } from '../../store/slices/uiSlice';
import { subscribeToComments } from '../../services/firebase/comments.service';
import { getUserById } from '../../services/firebase/users.service';
import { Comment, User } from '../../types';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { colors, typography, spacing } from '../../theme';
import { formatNumber } from '../../utils/formatNumber';

import { useNavigation } from '@react-navigation/native';

interface Props { videoId: string; }

export default function CommentSheet({ videoId }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const sheetRef = useRef<BottomSheet>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [authors, setAuthors] = useState<Record<string, User>>({});

  useEffect(() => {
    const unsubscribe = subscribeToComments(videoId, async newComments => {
      setComments(newComments);
      const missing = [...new Set(newComments.filter(c => !authors[c.authorId]).map(c => c.authorId))];
      if (missing.length > 0) {
        const fetched = await Promise.all(missing.map(uid => getUserById(uid)));
        setAuthors(prev => { const next = { ...prev }; missing.forEach((uid, i) => { if (fetched[i]) next[uid] = fetched[i]!; }); return next; });
      }
    });
    return unsubscribe;
  }, [videoId, authors]);

  const handleProfilePress = useCallback((userId: string) => {
    dispatch(clearCommentSheet());
    navigation.navigate('UserProfile', { userId });
  }, [dispatch, navigation]);

  return (
    <BottomSheet ref={sheetRef} snapPoints={['70%', '95%']} onClose={() => dispatch(clearCommentSheet())} enablePanDownToClose backgroundStyle={styles.background} handleIndicatorStyle={styles.handle}>
      <View style={styles.header}><Text style={styles.title}>{formatNumber(comments.length)} commentaires</Text></View>
      <BottomSheetFlatList 
        data={comments} 
        keyExtractor={item => item.commentId} 
        renderItem={({ item }) => (
          <CommentItem 
            comment={item} 
            author={authors[item.authorId] ?? null} 
            onProfilePress={() => handleProfilePress(item.authorId)}
          />
        )} 
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>Soyez le premier à commenter</Text></View>} 
        contentContainerStyle={{ paddingBottom: 80 }} 
      />
      <CommentInput videoId={videoId} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: colors.surface, borderRadius: 16 },
  handle: { backgroundColor: colors.gray, width: 40, height: 4 },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: colors.grayLight },
  title: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
  empty: { padding: spacing.xxxl, alignItems: 'center' },
  emptyText: { color: colors.gray },
});
