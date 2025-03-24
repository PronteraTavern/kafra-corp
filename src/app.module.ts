import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.validation';
import { databaseConfig } from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { googleOAuthConfig } from './config/google-oauth.config';
import { refreshJwtConfig } from './config/refresh-jwt.config';
import { TripsModule } from './trips/trips.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        googleOAuthConfig,
        refreshJwtConfig,
      ],
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    TripsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
