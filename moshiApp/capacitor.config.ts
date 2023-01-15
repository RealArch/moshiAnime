import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.realarch.moshianime',
  appName: 'moshiApp',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    "SplashScreen": {
      "launchAutoHide": false,
      "androidScaleType": "CENTER_CROP",
      // "showSpinner": true,
      "splashFullScreen": false,
      "splashImmersive": false
    }
  }
};

export default config;
