import * as dotenv from 'dotenv';
dotenv.config();

export const configuration = () => ({
  port: parseInt(process.env.PORT || '5000'),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h',
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
}); 

export class EnvironmentVariables {
  PORT: string = process.env.PORT;
  JWT_SECRET: string = process.env.JWT_SECRET;
  MONGODB_URI: string = process.env.MONGODB_URI;
  GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID;
  GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET;
  GOOGLE_CALLBACK_URL: string = process.env.GOOGLE_CALLBACK_URL;

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is missing`);
      }
    }
  }
}

export function validateEnvVariables(): void {
  const config = new EnvironmentVariables();
  try {
    config.validateConfig();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
} 