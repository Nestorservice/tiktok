import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { colors, spacing } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import { addComment } from '../../services/firebase/comments.service';

interface Props { videoId: string; }

export default function CommentInput({ videoId }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const user = useAppSelector(s => s.auth.user);

  async function handleSend() {
    if (!text.trim() || !user || sending) return;
    setSending(true);
    try { await addComment(videoId, user.uid, text.trim()); setText(''); }
    finally { setSending(false); }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={60}>
      <View style={styles.container}>
        <FastImage source={user?.avatar ? { uri: user.avatar } : undefined} style={styles.avatar} />
        <TextInput style={styles.input} placeholder="Ajouter un commentaire..." placeholderTextColor={colors.gray} value={text} onChangeText={setText} returnKeyType="send" onSubmitEditing={handleSend} />
        <TouchableOpacity onPress={handleSend} disabled={!text.trim() || sending}>
          <Ionicons name="send" size={22} color={text.trim() ? colors.primary : colors.gray} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderTopWidth: 0.5, borderTopColor: colors.grayLight, backgroundColor: colors.surface },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceLight, marginRight: spacing.sm },
  input: { flex: 1, backgroundColor: colors.surfaceLight, color: colors.white, borderRadius: 20, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, fontSize: 14, marginRight: spacing.sm, maxHeight: 80 },
});
