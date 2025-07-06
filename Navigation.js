import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import MapScreen from './screens/MapScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';

// Stack navigator oluşturuluyor
const Stack = createNativeStackNavigator();

/**
 * Navigation
 * Uygulamanın tüm ekranlarını yöneten ana navigasyon bileşeni.
 * - HomeScreen: Görevlerin listelendiği ana ekran
 * - AddTaskScreen: Yeni görev ekleme ekranı
 * - TaskDetailScreen: Görev detay ekranı
 * - MapScreen: Harita ve konum seçme ekranı
 */
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Anasayfa' }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ title: 'Yeni Görev' }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ title: 'Görev Detayı' }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: 'Konum Seç' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
