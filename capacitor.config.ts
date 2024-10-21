import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  server:{
   // url:"http://192.168.1.15:8100",
    cleartext: true
  },

  appId: 'io.ionic.starter',
  appName: 'shop',
  webDir: 'www',
  plugins: {
    GoogleMaps: {
      apiKey: 'AIzaSyCsGGf9_VzZd7-PJldeBLq159hXp7stEcU' // Reemplaza esto con tu clave API de Google Maps
    }
  }
};

export default config;