import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
// @ts-nocheck
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import CenterFab from '@/components/ui/center-fab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        // 🎨 APENAS O FUNDO DA TAB BAR
        tabBarStyle: {
          backgroundColor: '#333030',
          borderTopColor: '#333030',
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: () => (
            <IconSymbol size={28} name="house.fill" color="#ffffffff" />
          ),
        }}
      />

      {/* CONQUISTAS */}
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Conquistas',
          tabBarIcon: () => (
            <Ionicons name="trophy" size={28} color="#FFB800" />
          ),
        }}
      />

      {/* RELATÓRIOS (FAB CENTRAL) */}
      <Tabs.Screen
        name="report"
        options={{
          title: 'Relatórios',
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart" size={28} color={color} />
          ),
          tabBarButton: (props) => <CenterFab {...props} />,
        }}
      />

      {/* METAS */}
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Metas',
          tabBarIcon: () => (
            <Ionicons name="flag" size={28} color="#0D9AFE" />
          ),
        }}
      />

      {/* CONFIGURAÇÕES */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
        }}
      />

      {/* TELAS OCULTAS */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
      <Tabs.Screen name="forgot_password" options={{ href: null }} />
    </Tabs>
  );
}
