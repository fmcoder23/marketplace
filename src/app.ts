import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Configuration } from '@config';
import { PrismaModule } from '@prisma'
import { AuthModule, UsersModule } from '@module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
  ],
})
export class AppModule { }
