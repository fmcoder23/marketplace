import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Configuration } from '@config';
import { PrismaModule } from '@prisma'
import { AuthModule, MarketsModule, UploadModule, UsersModule } from '@module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
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
