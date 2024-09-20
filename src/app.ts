import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma'
import { AuthModule, CartsModule, CategoriesModule, FavoritesModule, LocationsModule, MarketsModule, OrdersModule, ProductsModule, UploadModule, UsersModule } from '@module'
import { AppConfig, DbConfig, JwtConfig, R2Config, SwaggerConfig } from '@config';
import { WaybillsModule } from './module/waybills';

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
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    CartsModule,
    WaybillsModule,
    FavoritesModule
  ],
})
export class AppModule { }
