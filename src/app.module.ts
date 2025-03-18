import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.validation';
import { databaseConfig } from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { googleOAuthConfig } from './config/google-oauth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [appConfig, databaseConfig, jwtConfig, googleOAuthConfig],
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
