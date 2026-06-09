import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, clearUser } from '../store/slices/authSlice';
import { onAuthStateChange } from '../services/firebase/auth.service';
import { getUserById } from '../services/firebase/users.service';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { colors } from '../theme';

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(s => s.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async uid => {
      if (uid) {
        const userData = await getUserById(uid);
        if (userData) dispatch(setUser(userData));
        else dispatch(clearUser());
      } else {
        dispatch(clearUser());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  if (isLoading) {
    return <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
});
