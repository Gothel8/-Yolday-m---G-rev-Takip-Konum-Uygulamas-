import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';

/**
 * TaskDetailScreen
 * Seçilen görevin detaylarını ve varsa konumunu gösteren ekran.
 * - Görev başlığı ve açıklaması görüntülenir.
 * - Eğer görevde konum varsa, harita üzerinde marker ile gösterilir.
 * - Kullanıcı "Geri Dön" butonuyla ana ekrana dönebilir.
 */
export default function TaskDetailScreen({ route, navigation }) {
  // Parametrelerden gelen görev ID'sini al
  const { taskId } = route.params;

  // Redux store'dan ilgili görevi bul
  // id karşılaştırmasını string olarak yap!
  const task = useSelector(state =>
    state.tasks.tasks.find(t => t.id.toString() === taskId.toString())
  );

  // Görev bulunamazsa kullanıcıya bilgi ver
  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Görev bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Görev başlığı */}
      <Text style={styles.title}>{task.title}</Text>

      {/* Açıklama varsa göster */}
      {task.description ? (
        <Text style={styles.description}>{task.description}</Text>
      ) : null}

      {/* Konum varsa harita üzerinde göster */}
      {task.location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: task.location.latitude,
            longitude: task.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={task.location} />
        </MapView>
      ) : null}

      {/* Geri dön butonu */}
      <Button title="Geri Dön" onPress={() => navigation.goBack()} />
    </View>
  );
}

// Ekran stilleri
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});
