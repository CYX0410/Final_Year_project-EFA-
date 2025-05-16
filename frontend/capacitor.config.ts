import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.efa.app',
  appName: 'EFA',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: [
      'http://13.250.42.49:5010/*'
    ]
  },
  android: {
    allowMixedContent: true
  }
};

export default config;