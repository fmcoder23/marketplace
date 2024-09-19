import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma'
import { AuthModule, MarketsModule, UploadModule, UsersModule } from '@module'
import { AppConfig, DbConfig, JwtConfig, R2Config, SwaggerConfig } from '@config';
import { LocationsModule } from './module/locations';
import { CategoriesModule } from './module/categories';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        AppConfig,
        DbConfig,
        JwtConfig,
        R2Config,
        SwaggerConfig
      ],
      isGlobal: true
    }),
    UploadModule,
    AuthModule,
    UsersModule,
    PrismaModule,
    MarketsModule,
    LocationsModule,
    CategoriesModule
  ],
})
export class AppModule { }
