// app/_layout.tsx
// @ts-nocheck
import React, { useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatsProvider } from '@/context/StatsContext';
import { ReportsProvider } from '@/context/ReportsContext';

// Firebase imports
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { createUserInFirestore } from '@/firebase/createUserInFirestore';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Listener que garante que o usuário será criado/atualizado no Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await createUserInFirestore(user);
        } catch (error) {
          console.warn("Erro ao criar/atualizar usuário no Firestore:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* 👇 AGORA O APP TODO TEM ACESSO A RELATÓRIOS E A CONQUISTAS */}
      <StatsProvider>
        <ReportsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Telas de Autenticação */}
            <Stack.Screen name="index" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgot_password" />

            {/* Telas do App */}
            <Stack.Screen name="profile" />

            {/* App Principal com Abas */}
            <Stack.Screen name="goals" />
            <Stack.Screen name="(tabs)" />

            {/* Modal */}
            <Stack.Screen
              name="modal"
              options={{ presentation: 'modal', title: 'Modal' }}
            />
          </Stack>
        </ReportsProvider>
      </StatsProvider>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
