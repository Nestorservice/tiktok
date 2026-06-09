import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import { subscribeToNotifications, markNotificationRead } from '../../services/notifications.service';
import { Notification } from '../../types';

import { EMPTY_STATES } from '../../utils/constants';

const TABS = ['Tout', "J'aime", 'Commentaires', 'Mentions', 'Abonnés'];
const TYPE_MAP: Record<string, Notification['type']> = { "J'aime": 'like', 'Commentaires': 'comment', 'Mentions': 'mention', 'Abonnés': 'follow' };

export default function InboxScreen() {
  const uid = useAppSelector(s => s.auth.user?.uid);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    try {
      return subscribeToNotifications(uid, setNotifications);
    } catch {
      setError("Impossible de charger les notifications");
    }
  }, [uid]);

  const filtered = activeTab === 0 ? notifications : notifications.filter(n => n.type === TYPE_MAP[TABS[activeTab]]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Activité</Text>
      <FlatList data={TABS} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs} keyExtractor={item => item}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setActiveTab(index)} style={[styles.tab, activeTab === index && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>{item}</Text>
          </TouchableOpacity>
        )} />
      {error ? (
        <View style={styles.empty}><Text style={styles.errorText}>{error}</Text></View>
      ) : (
        <FlatList data={filtered} keyExtractor={(item, i) => `${item.fromUid}-${i}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.row, !item.isRead && styles.rowUnread]} onPress={() => uid && markNotificationRead(uid, item.fromUid)}>
              <View style={styles.avatar} />
              <View style={styles.content}><Text style={styles.notifText}>{item.text}</Text></View>
              {item.videoId && <View style={styles.thumb} />}
            </TouchableOpacity>
          )}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>{EMPTY_STATES.inbox}</Text></View>} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.white, fontWeight: typography.bold, fontSize: 18, textAlign: 'center', paddingVertical: spacing.md },
  tabs: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md },
  tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.white },
  tabText: { color: colors.gray, fontSize: typography.sm },
  tabTextActive: { color: colors.white, fontWeight: typography.bold },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md },
  rowUnread: { backgroundColor: 'rgba(255,255,255,0.05)' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceLight },
  content: { flex: 1 },
  notifText: { color: colors.white, fontSize: typography.sm },
  thumb: { width: 42, height: 54, borderRadius: 4, backgroundColor: colors.surfaceLight },
  empty: { padding: spacing.xxxl, alignItems: 'center' },
  emptyText: { color: colors.gray },
  errorText: { color: colors.primary, textAlign: 'center' },
});
