import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import store from './store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadTasks, fetchTasksFromAPI } from './taskSlice';
import Navigation from './Navigation';

/**
 * AppWrapper
 * Uygulama başlatıldığında local storage'dan görevleri yükler ve API'den görevleri çeker.
 * Redux Provider'ın içinde çalışır.
 */
function AppWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    // AsyncStorage'dan görevleri yükle
    const loadFromStorage = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('TASKS');
        if (jsonValue != null) {
          const parsed = JSON.parse(jsonValue);
          dispatch(loadTasks(parsed)); // Local görevleri store'a yükle
        }
      } catch (e) {
        console.error('Görevleri yüklerken hata:', e);
      }
    };

    loadFromStorage();
    dispatch(fetchTasksFromAPI()); // API'den görevleri çek
  }, []);

  return <Navigation />;
}

/**
 * App
 * Redux Provider ile uygulamanın tamamını sarmalar.
 */
export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}
