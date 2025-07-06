import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * State'in başlangıç değeri:
 * - tasks: Görevler dizisi
 * - filter: Aktif görev filtresi (all/completed/incomplete)
 * - sortBy: Sıralama kriteri (date/title)
 * - selectedLocation: Haritadan seçilen konum
 */
const initialState = {
  tasks: [],
  filter: 'all',
  sortBy: 'date',
  selectedLocation: null,
};

/**
 * API'den görevleri çekmek için asenkron thunk.
 * jsonplaceholder'dan 5 görev alır ve uygun formata çevirir.
 */
export const fetchTasksFromAPI = createAsyncThunk(
  'tasks/fetchFromAPI',
  async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
    return response.data.map(item => ({
      id: item.id.toString(),
      title: item.title,
      description: '',
      completed: item.completed,
      location: null,
      createdAt: new Date().toISOString(),
    }));
  }
);

/**
 * API'ye yeni görev eklemek için asenkron thunk.
 * Görev eklendikten sonra dönen veriyi uygun formata çevirir.
 */
export const postTaskToAPI = createAsyncThunk(
  'tasks/postToAPI',
  async (newTask) => {
    const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
      title: newTask.title,
      completed: false,
      description: newTask.description || '',
      location: newTask.location || null,
      createdAt: new Date().toISOString(),
    });
    return {
      ...response.data,
      id: response.data.id.toString(),
      description: newTask.description,
      location: newTask.location,
      createdAt: newTask.createdAt || new Date().toISOString(),
      completed: false,
    };
  }
);

/**
 * tasksSlice
 * Tüm görev işlemlerini ve filtre/sıralama ayarlarını yöneten slice.
 */
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    /**
     * Yeni görev ekler (local)
     */
    addTask: (state, action) => {
      const { title, description, location } = action.payload;
      state.tasks.push({
        id: Date.now().toString(),
        title,
        description,
        completed: false,
        location: location || null,
        createdAt: new Date().toISOString(),
      });
    },
    /**
     * Görevin tamamlanma durumunu değiştirir
     */
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id.toString() === action.payload.toString());
      if (task) {
        task.completed = !task.completed;
      }
    },
    /**
     * Görev siler
     */
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id.toString() !== action.payload.toString());
    },
    /**
     * Aktif filtreyi değiştirir
     */
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    /**
     * Sıralama kriterini değiştirir
     */
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    /**
     * Seçili konumu ayarlar
     */
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    /**
     * AsyncStorage'dan yüklenen görevleri store'a aktarır
     */
    loadTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // API'den görevler başarıyla çekildiğinde store'a aktar
      .addCase(fetchTasksFromAPI.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      // API'ye görev başarıyla eklendiğinde store'a ekle
      .addCase(postTaskToAPI.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      });
  }
});

// Export edilen aksiyonlar
export const {
  addTask,
  toggleTask,
  deleteTask,
  setFilter,
  setSortBy,
  setSelectedLocation,
  loadTasks,
} = tasksSlice.actions;

// Varsayılan olarak reducer'ı export et
export default tasksSlice.reducer;
