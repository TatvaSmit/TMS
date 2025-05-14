import * as dotenv from "dotenv";
// loading env variables at the start of the server
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { json, urlencoded } from "express";
import { configuration, validateEnvVariables } from "./config/configuration";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import passport from "passport";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

async function bootstrap() {
  //validating env variables
  validateEnvVariables();

  const app = await NestFactory.create(AppModule);
  const config = configuration();
  //initializing passport
  app.use(passport.initialize());
  //we are setting up global validation pipe here.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );
  //adding here common response interceptor to keep the response consistent
  app.useGlobalInterceptors(new ResponseInterceptor());
  // adding global error handler 
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());
  app.enableCors({
    // origin: 'https://tms-fe-wbeq.onrender.com',
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  await app.listen(config.port);
}

bootstrap();
