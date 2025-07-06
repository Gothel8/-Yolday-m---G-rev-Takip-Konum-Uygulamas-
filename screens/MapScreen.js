import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Button, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { setSelectedLocation } from '../taskSlice';
import { MAPBOX_TOKEN } from '@env';

/**
 * MapScreen
 * Kullanıcıya harita üzerinde konum seçtiren ve seçilen konuma rota çizen ekran.
 * - Kullanıcının mevcut konumunu alır.
 * - Marker eklenince Mapbox Directions API ile rota çizer.
 * - Tüm görevlerin marker'larını gösterir.
 * - Seçilen konumu Redux store'a kaydeder.
 */
export default function MapScreen({ navigation }) {
  const dispatch = useDispatch();
  const selectedLocation = useSelector(state => state.tasks.selectedLocation);
  const tasks = useSelector(state => state.tasks.tasks);

  // State'ler
  const [currentLocation, setCurrentLocation] = useState(null); // Kullanıcının mevcut konumu
  const [markerCoord, setMarkerCoord] = useState(null);         // Seçilen marker koordinatı
  const [routeCoords, setRouteCoords] = useState([]);           // Polyline için rota koordinatları
  const [loadingRoute, setLoadingRoute] = useState(false);      // Rota yükleniyor mu?

  // Harita her açıldığında kullanıcının konumunu al
  useFocusEffect(
    useCallback(() => {
      (async () => {
        // Konum izni iste
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Konum izni reddedildi');
          return;
        }

        // Kullanıcının mevcut konumunu al
        let location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setCurrentLocation(userLocation);

        // Önceden seçilmiş konum varsa marker olarak göster
        if (selectedLocation) {
          setMarkerCoord(selectedLocation);
        } else {
          setMarkerCoord(null);
        }
      })();
    }, [selectedLocation])
  );

  /**
   * Mapbox Directions API'dan iki nokta arası rota verisi alır.
   * @param {Object} start Başlangıç koordinatı {latitude, longitude}
   * @param {Object} end Bitiş koordinatı {latitude, longitude}
   */
  const fetchRoute = async (start, end) => {
    setLoadingRoute(true);
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      const response = await fetch(url);
      const data = await response.json();
      if (
        data.routes &&
        data.routes.length > 0 &&
        data.routes[0].geometry &&
        data.routes[0].geometry.coordinates
      ) {
        // Mapbox koordinatlarını Polyline için dönüştür
        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));
        setRouteCoords(coords);
      } else {
        setRouteCoords([]);
      }
    } catch (e) {
      setRouteCoords([]);
    }
    setLoadingRoute(false);
  };

  // Marker veya konum değişince rota çek
  React.useEffect(() => {
    if (currentLocation && markerCoord) {
      fetchRoute(currentLocation, markerCoord);
    } else {
      setRouteCoords([]);
    }
  }, [currentLocation, markerCoord]);

  /**
   * Harita üzerine tıklanınca marker ekler.
   * @param {Object} e MapView press event
   */
  const handlePress = (e) => {
    const coord = e.nativeEvent.coordinate;
    setMarkerCoord(coord);
  };

  /**
   * Seçilen konumu Redux store'a kaydeder ve ekrana geri döner.
   */
  const handleConfirm = () => {
    if (markerCoord) {
      dispatch(setSelectedLocation(markerCoord));
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        // Türkiye'nin büyük kısmını gösterecek şekilde geniş açıyla başlat
        initialRegion={{
          latitude: currentLocation?.latitude || 39.0,      // Türkiye'nin ortası
          longitude: currentLocation?.longitude || 35.0,
          latitudeDelta: 5,   // Geniş açı
          longitudeDelta: 5,
        }}
        onPress={handlePress}
      >
        {/* Kullanıcının mevcut konumu */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Benim Konumum"
            pinColor="blue"
          />
        )}

        {/* Seçilen konuma marker */}
        {markerCoord && (
          <Marker
            coordinate={markerCoord}
            title="Seçilen Konum"
            pinColor="green"
          />
        )}

        {/* Tüm görevlerin marker'ları */}
        {tasks.map(task =>
          task.location ? (
            <Marker
              key={task.id}
              coordinate={task.location}
              title={task.title}
              description={task.description}
              pinColor="red"
            />
          ) : null
        )}

        {/* Gerçek rota polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#1e90ff"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Rota yükleniyorsa gösterge */}
      {loadingRoute && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1e90ff" />
        </View>
      )}

      {/* Konumu Onayla butonu */}
      <View style={styles.buttonWrapper}>
        <Button title="Konumu Onayla" onPress={handleConfirm} color="#27ae60" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'absolute',
    bottom: 60,
    left: 24,
    right: 24,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 8,
    elevation: 5,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
});
