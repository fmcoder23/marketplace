import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma'
import { AuthModule, MarketsModule, UploadModule, UsersModule } from '@module'
import { AppConfig, DbConfig, JwtConfig, R2Config, SwaggerConfig } from '@config';

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
    MarketsModule
  ],
})
export class AppModule { }
