import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const BASE_URL = 'https://backpack-outcast-upfront.ngrok-free.dev'; // Ganti dengan IP aslimu

// 1. Buat "Interface" untuk mendefinisikan bentuk data produk/toko
interface Store {
  id: number;
  nama_toko: string;
  jarak_km?: number; // Pakai tanda tanya (?) jika kadang tidak dikirim dari BE
  jarak?: number;
  ongkir?: number;
}

export default function NearbyStoresScreen() {
  // 2. Beri tahu state kalau array ini akan berisi objek Store
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    // 3. Deklarasikan tipe langganan lokasi dari Expo
    let locationSubscription: Location.LocationSubscription | null = null;

    const startSilentSync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return; 

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, 
          distanceInterval: 20, 
        },
        async (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          
          try {
            const response = await axios.post(`${BASE_URL}/api/getProduct`, {
              lat: latitude,
              lng: longitude
            });

            if (response.data.success) {
              setStores(response.data.data);
            }
          } catch (error) {
            // 4. Cara mengatasi error 'unknown' di catch TypeScript
            if (axios.isAxiosError(error)) {
              console.log('Silent sync failed:', error.message);
            } else if (error instanceof Error) {
              console.log('Silent sync failed:', error.message);
            } else {
              console.log('Terjadi error yang tidak diketahui');
            }
          }
        }
      );
    };

    startSilentSync();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // 5. Beri tipe data pada parameter item di FlatList
  const renderStoreItem = ({ item }: { item: Store }) => (
    <View style={styles.card}>
      <Text style={styles.storeName}>{item.nama_toko}</Text>
      {/* Cek apakah pakai jarak_km atau jarak, sesuaikan dengan nama variabel dari backend-mu */}
      <Text style={styles.distance}>
        Jarak: {item.jarak_km ? item.jarak_km.toFixed(2) : item.jarak?.toFixed(2)} KM
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStoreItem}
        ListEmptyComponent={<Text style={styles.empty}>Mencari toko terdekat...</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  card: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  storeName: { fontSize: 16, fontWeight: 'bold' },
  distance: { fontSize: 14, color: 'green', marginTop: 5 },
  empty: { textAlign: 'center', marginTop: 20, color: 'gray' }
});