import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';

/**
 * Redux Store
 * Uygulamanın global state yönetimini sağlar.
 * - tasks: Tüm görevlerle ilgili state'i yöneten reducer.
 */
const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

export default store;
