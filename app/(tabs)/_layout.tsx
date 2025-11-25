import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
// @ts-nocheck
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import CenterFab from '@/components/ui/center-fab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color="#ffff" />,
        }}
      />
      <Tabs.Screen
  name="achievements"
  options={{
    title: 'Conquistas',
    tabBarIcon: () => (
      <Ionicons name="trophy" size={28} color="#FFB800" />
    ),
  }}
    />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Relatórios',
          tabBarIcon: ({ color }) => <Ionicons name="bar-chart" size={28} color={color} />,
          // show a custom centered FAB inside the tab bar
          tabBarButton: (props) => <CenterFab {...props} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Metas',
          tabBarIcon: ({ color }) => <Ionicons name="flag" size={28} color="#0D9AFE" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={28} color={color} />,
        }}
      />
      {/* Telas de autenticação (ocultas da barra de abas) */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="forgot_password"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}