import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.efa.app',
  appName: 'EFA',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: [
      'http://18.141.182.235:5010/*'
    ]
  },
  android: {
    allowMixedContent: true
  }
};

export default config;