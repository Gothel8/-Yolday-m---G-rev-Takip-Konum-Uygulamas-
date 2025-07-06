import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTask, deleteTask, setFilter, setSortBy } from '../taskSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * HomeScreen
 * Görevlerin listelendiği, filtrelendiği ve sıralandığı ana ekran.
 * - Görev ekleme, silme, tamamlama, filtreleme ve sıralama işlemleri yapılabilir.
 * - Görev detayına ve harita ekranına geçiş yapılabilir.
 */
export default function HomeScreen({ navigation }) {
  // Redux store'dan görevler, filtre ve sıralama bilgilerini al
  const { tasks, filter, sortBy } = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  // Görevler değiştikçe local storage'a kaydet
  useEffect(() => {
    AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
  }, [tasks]);

  /**
   * Filtreye göre görevleri süz
   */
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true; // Hepsi
  });

  /**
   * Sıralama kriterine göre görevleri sırala
   */
  const sortedTasks = filteredTasks.slice().sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  /**
   * Her bir görev için render edilecek öğe
   */
  const renderItem = ({ item }) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    return (
      <View style={styles.taskItem}>
        {/* Görev tamamlandıysa işaretle */}
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => dispatch(toggleTask(item.id))}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        {/* Görev detayına git */}
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
        >
          <Text style={[styles.taskTitle, item.completed && styles.completed]}>
            {item.title}
          </Text>
          {/* Açıklama varsa göster */}
          {item.description ? (
            <Text style={styles.taskDescription}>{item.description}</Text>
          ) : null}
          {/* Oluşturulma tarihi */}
          <Text style={styles.taskDate}>{formattedDate}</Text>
        </TouchableOpacity>
        {/* Görevi sil */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => dispatch(deleteTask(item.id))}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Sil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Ekran başlığı */}
      <Text style={styles.header}>Görevler</Text>
      {/* Yeni görev ve harita butonları */}
      <View style={styles.topButtonsRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Text style={styles.addButtonText}>+ Yeni</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={styles.mapButtonText}>Harita</Text>
        </TouchableOpacity>
      </View>

      {/* Filtre butonları */}
      <View style={styles.filterSortRow}>
        <View style={styles.filterGroup}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => dispatch(setFilter('all'))}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>Hepsi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
            onPress={() => dispatch(setFilter('completed'))}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>Tamamlanan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'incomplete' && styles.activeFilter]}
            onPress={() => dispatch(setFilter('incomplete'))}
          >
            <Text style={[styles.filterText, filter === 'incomplete' && styles.activeFilterText]}>Tamamlanmamış</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sıralama butonları */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sırala:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'date' && styles.activeSort, { marginLeft: 0 }]}
          onPress={() => dispatch(setSortBy('date'))}
        >
          <Text style={[styles.sortText, sortBy === 'date' && styles.activeSortText]}>Tarih</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'title' && styles.activeSort]}
          onPress={() => dispatch(setSortBy('title'))}
        >
          <Text style={[styles.sortText, sortBy === 'title' && styles.activeSortText]}>Başlık</Text>
        </TouchableOpacity>
      </View>

      {/* Görevler listesi */}
      <FlatList
        data={sortedTasks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        style={{ marginTop: 10 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz görev yok.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f7fafd',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4F8EF7',
    letterSpacing: 1,
    marginBottom: 8,
  },
  topButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 2,
    marginRight: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mapButton: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 2,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterSortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
    alignItems: 'center',
  },
  filterGroup: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#eaf6ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  activeFilter: {
    backgroundColor: '#4F8EF7',
  },
  filterText: {
    color: '#4F8EF7',
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: '#fff',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 0,
  },
  sortLabel: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
    fontSize: 15,
  },
  sortButton: {
    backgroundColor: '#eaf6ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  activeSort: {
    backgroundColor: '#27ae60',
  },
  sortText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  activeSortText: {
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#4F8EF7',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#f0f6ff',
  },
  checkmark: {
    fontSize: 20,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  taskDescription: {
    fontSize: 15,
    color: '#555',
    marginTop: 2,
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 7,
    marginLeft: 10,
    alignSelf: 'center',
    elevation: 2,
  },
});
