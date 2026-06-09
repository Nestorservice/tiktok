import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../../theme';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/slices/authSlice';
import { updateUserProfile } from '../../services/firebase/users.service';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!user) return;
    setIsSaving(true);
    try { await updateUserProfile(user.uid, { displayName, bio }); dispatch(setUser({ ...user, displayName, bio })); navigation.goBack(); }
    finally { setIsSaving(false); }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.cancel}>Annuler</Text></TouchableOpacity>
        <Text style={styles.title}>Modifier le profil</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color={colors.primary} size="small" /> : <Text style={styles.save}>Sauvegarder</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nom d'affichage</Text>
        <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} placeholderTextColor={colors.gray} />
        <Text style={styles.label}>Bio</Text>
        <TextInput style={[styles.input, styles.bioInput]} value={bio} onChangeText={setBio} multiline maxLength={150} placeholderTextColor={colors.gray} placeholder="Parle de toi..." />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.grayLight },
  cancel: { color: colors.white, fontSize: typography.base },
  title: { color: colors.white, fontWeight: typography.bold, fontSize: typography.lg },
  save: { color: colors.primary, fontWeight: typography.bold, fontSize: typography.base },
  form: { padding: spacing.lg },
  label: { color: colors.gray, fontSize: typography.sm, marginBottom: spacing.xs, marginTop: spacing.lg },
  input: { backgroundColor: colors.surfaceLight, color: colors.white, borderRadius: 8, padding: spacing.md, fontSize: typography.base },
  bioInput: { height: 80, textAlignVertical: 'top' },
});
