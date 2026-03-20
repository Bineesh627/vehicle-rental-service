import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { RentalShop } from "@/types";

interface MapViewProps {
  shops: RentalShop[];
  onShopClick: (shopId: string) => void;
}

export const NativeMapView = ({ shops, onShopClick }: MapViewProps) => {
  const webViewRef = useRef<WebView>(null);

  // Default coordinate if shop list is empty
  const defaultLat = 37.78825;
  const defaultLng = -122.4324;
  
  const centerLat = shops.length > 0 && shops[0].latitude ? shops[0].latitude : defaultLat;
  const centerLng = shops.length > 0 && shops[0].longitude ? shops[0].longitude : defaultLng;

  // We need to inject the shops as markers into the Leaflet map
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      body { margin: 0; padding: 0; overflow: hidden; background-color: #0F1C23; }
      #map { width: 100%; height: 100vh; }
      .leaflet-control-zoom { display: none; }
      
      .custom-popup .leaflet-popup-content-wrapper {
        background: #1E293B;
        color: #fff;
        border-radius: 8px;
        border: 1px solid #334155;
      }
      .custom-popup .leaflet-popup-tip {
        background: #1E293B;
      }
      .popup-title {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 4px;
        color: #22D3EE;
      }
      .popup-address {
        font-size: 12px;
        color: #94A3B8;
        margin-bottom: 8px;
      }
      .popup-btn {
        background: #22D3EE;
        color: #0F1C23;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: bold;
        width: 100%;
        cursor: pointer;
      }
    </style>
    </head>
    <body>
    <div id="map"></div>
    <script>
      const map = L.map('map', { zoomControl: false }).setView([${centerLat}, ${centerLng}], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const stationIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const shops = ${JSON.stringify(
        shops.map(s => ({
          id: s.id,
          name: s.name,
          address: s.address,
          lat: s.latitude || defaultLat,
          lng: s.longitude || defaultLng
        }))
      )};

      const markers = [];

      shops.forEach(shop => {
        const marker = L.marker([shop.lat, shop.lng], { icon: stationIcon }).addTo(map);
        
        const popupContent = \`
          <div class="popup-title">\${shop.name}</div>
          <div class="popup-address">\${shop.address}</div>
          <button class="popup-btn" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SHOP_CLICK', id: '\${shop.id}' }))">View Details</button>
        \`;
        
        marker.bindPopup(popupContent, { className: 'custom-popup' });
        markers.push(marker);
      });

      // Fit bounds if there are markers
      if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
      }

    </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SHOP_CLICK' && data.id) {
        onShopClick(data.id);
      }
    } catch (e) {
      console.error("Failed to parse webview message", e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={styles.map}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        onMessage={handleMessage}
        scrollEnabled={false}
      />
      <View style={styles.overlay}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {shops.length} rental shops nearby
          </Text>
        </View>
      </View>
    </View>
  );
};

export { NativeMapView as MapView };

const styles = StyleSheet.create({
  container: {
    height: 256, // h-64 equivalent
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0F1C23", // Keep dark theme consistent behind webview
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  pill: {
    backgroundColor: "rgba(30, 41, 59, 0.95)", // #1E293B matching dark theme
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0", // Slate 200
  },
});
