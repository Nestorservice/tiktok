import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../../theme';

type Speed = '0.3x' | '0.5x' | '1x' | '2x' | '3x';
const SPEEDS: Speed[] = ['0.3x', '0.5x', '1x', '2x', '3x'];

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const device = useCameraDevice(facing);
  const { hasPermission: hasCam, requestPermission: reqCam } = useCameraPermission();
  const { hasPermission: hasMic, requestPermission: reqMic } = useMicrophonePermission();
  const cameraRef = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speed, setSpeed] = useState<Speed>('1x');

  useEffect(() => {
    if (!hasCam) reqCam();
    if (!hasMic) reqMic();
  }, [hasCam, hasMic, reqCam, reqMic]);

  const startRecording = useCallback(async () => {
    if (!cameraRef.current) return;
    setIsRecording(true);
    cameraRef.current.startRecording({
      onRecordingFinished: video => { setIsRecording(false); navigation.navigate('Post', { videoUri: video.path, duration: video.duration ?? 15 }); },
      onRecordingError: () => { setIsRecording(false); Alert.alert('Erreur', "L'enregistrement a échoué"); },
    });
  }, [navigation]);

  const stopRecording = useCallback(async () => { await cameraRef.current?.stopRecording(); }, []);

  if (!hasCam || !hasMic) {
    return (
      <View style={styles.permContainer}>
        <Text style={styles.permText}>Autorisations caméra et microphone requises.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={() => { reqCam(); reqMic(); }}>
          <Text style={styles.permBtnText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {device && <Camera ref={cameraRef} style={StyleSheet.absoluteFill} device={device} isActive video audio />}
      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.speedRow}>
          {SPEEDS.map(s => (
            <TouchableOpacity key={s} style={[styles.speedPill, speed === s && styles.speedActive]} onPress={() => setSpeed(s)}>
              <Text style={[styles.speedText, speed === s && styles.speedActiveText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.flipBtn} onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}>
          <Text style={styles.flipText}>⟳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.recordOuter, isRecording && styles.recordOuterActive]} onPressIn={startRecording} onPressOut={stopRecording} activeOpacity={1}>
          <View style={[styles.recordInner, isRecording && styles.recordInnerActive]} />
        </TouchableOpacity>
        <View style={styles.flipBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  overlay: { flex: 1 },
  closeBtn: { padding: spacing.lg },
  closeText: { color: colors.white, fontSize: 20 },
  speedRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md },
  speedPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  speedActive: { backgroundColor: colors.white },
  speedText: { color: colors.white, fontSize: typography.sm },
  speedActiveText: { color: colors.background, fontWeight: typography.bold },
  bottom: { position: 'absolute', bottom: 60, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: spacing.xl },
  flipBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  flipText: { color: colors.white, fontSize: 28 },
  recordOuter: { width: 86, height: 86, borderRadius: 43, borderWidth: 3, borderColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  recordOuterActive: { borderColor: colors.primary },
  recordInner: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.primary },
  recordInnerActive: { width: 40, height: 40, borderRadius: 8 },
  permContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  permText: { color: colors.white, textAlign: 'center', marginBottom: spacing.xl },
  permBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: 4 },
  permBtnText: { color: colors.white, fontWeight: typography.bold },
});
