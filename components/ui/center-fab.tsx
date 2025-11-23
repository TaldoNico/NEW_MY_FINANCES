import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CenterFab({ accessibilityState, onPress }: any) {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to Home and request create modal
    router.push('/(tabs)/home?create=1');
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -28 : -24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#29B529',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 4,
    borderColor: '#121212',
  },
});
