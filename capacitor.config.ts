import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'hq2',
  webDir: 'dist',
  server: {
    cleartext: true,
    allowNavigation: [
      "checkout.paystack.com",
      "s3-eu-west-1.amazonaws.com",
      "www.googletagmanager.com",
      "applepay.cdn-apple.com"
    ]
  }
};

export default config;
