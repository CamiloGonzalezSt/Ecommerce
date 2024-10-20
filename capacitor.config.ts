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
      apiKey: 'AIzaSyDgfNxLkMV22dNHMMQH3arPyO7vt5CsxC8' // Reemplaza esto con tu clave API de Google Maps
    }
  }
};

export default config;