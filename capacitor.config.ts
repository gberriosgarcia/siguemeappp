import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'siguemeappp',
  webDir: 'www',
  server: {
    androidScheme: 'https'  // ← asegura comunicación correcta con Android
  }
};

export default config;