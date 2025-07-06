import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { postTaskToAPI, setSelectedLocation } from '../taskSlice';

/**
 * AddTaskScreen
 * Kullanıcıların yeni görev ekleyebileceği ekran.
 * - Görev başlığı ve açıklaması girilebilir.
 * - İsteğe bağlı olarak harita üzerinden konum seçilebilir.
 * - Görev eklenince API'ye gönderilir ve Redux store'a kaydedilir.
 */
export default function AddTaskScreen({ navigation }) {
  // Redux store'dan seçilen konumu al
  const selectedLocation = useSelector(state => state.tasks.selectedLocation);

  // Yerel state: başlık ve açıklama
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  /**
   * Görev ekleme işlemini yönetir.
   * - Başlık boşsa işlem yapılmaz.
   * - API'ye yeni görev gönderilir.
   * - Başarılıysa konum sıfırlanır ve önceki ekrana dönülür.
   */
  const handleAddTask = () => {
    if (title.trim() === '') return; // Başlık boşsa ekleme

    dispatch(postTaskToAPI({ title, description, location: selectedLocation }))
      .then((action) => {
        if (postTaskToAPI.fulfilled.match(action)) {
          // Başarıyla eklendi
          console.log('Görev başarıyla eklendi:', action.payload);
          dispatch(setSelectedLocation(null)); // Seçili konumu sıfırla
          navigation.goBack(); // Önceki ekrana dön
        } else {
          // Hata oluştu
          console.error('Görev eklenirken hata:', action.error);
        }
      });
  };

  return (
    <View style={styles.container}>
      {/* Ekran başlığı */}
      <Text style={styles.header}>Yeni Görev Ekle</Text>

      {/* Görev başlığı alanı */}
      <Text style={styles.label}>Görev Başlığı</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Başlık girin"
        placeholderTextColor="#aaa"
      />

      {/* Konum seçme butonu */}
      <Button
        title="Konum Seç"
        color="#4F8EF7"
        onPress={() => navigation.navigate('Map')}
      />

      {/* Seçilen konum varsa göster */}
      {selectedLocation && (
        <View style={styles.locationBox}>
          <Text style={styles.locationText}>
            📍 Seçilen Konum: {selectedLocation.latitude}, {selectedLocation.longitude}
          </Text>
        </View>
      )}

      {/* Görev açıklaması alanı */}
      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Açıklama girin"
        placeholderTextColor="#aaa"
        multiline
      />

      {/* Görev ekle butonu */}
      <View style={styles.buttonWrapper}>
        <Button title="Görev Ekle" color="#27ae60" onPress={handleAddTask} />
      </View>
    </View>
  );
}

// Ekran stilleri
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7fafd',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F8EF7',
    marginBottom: 24,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#222',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  locationBox: {
    backgroundColor: '#eaf6ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#4F8EF7',
    fontWeight: '500',
    fontSize: 15,
  },
  buttonWrapper: {
    marginTop: 18,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
