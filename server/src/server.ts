import { app } from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎧 SONVÉRA Production Distribution Engine (API v1)`);
  console.log(`📡 URL: http://127.0.0.1:${PORT}`);
  console.log(`📘 Architecture: Modular Monolith (Express + TS)`);
  console.log(`🚀 Provider: DemoDistributionProvider (DDEX ERN 4.3)`);
  console.log(`====================================================`);
});
