import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma'
import { AuthModule, CartsModule, CategoriesModule, FavoritesModule, LocationsModule, MarketsModule, OrdersModule, ProductsModule, ReviewsModule, UploadModule, UsersModule } from '@module'
import { AppConfig, DbConfig, JwtConfig, MailConfig, R2Config, SwaggerConfig } from '@config';
import { WaybillsModule } from './module/waybills';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300000,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      load: [
        AppConfig,
        DbConfig,
        JwtConfig,
        R2Config,
        SwaggerConfig,
        MailConfig
      ],
      isGlobal: true
    }),
    UploadModule,
    AuthModule,
    UsersModule,
    PrismaModule,
    MarketsModule,
    LocationsModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    CartsModule,
    WaybillsModule,
    FavoritesModule,
    ReviewsModule
  ],
})
export class AppModule { }
