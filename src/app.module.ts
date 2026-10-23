import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BooksModule } from './books/books.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { LogMiddlewareMiddleware } from './middleware/log-middleware/log-middleware.middleware.js';

@Module({
  imports: [
    // (1) DIHAPUS: TypeOrmModule.forRoot({ type: 'mysql', ... }) karena koneksinya dobel
    BooksModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().valid('development','staging','production').default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306), // (2) 5432 -> 3306
        DB_USERNAME:Joi.string().required(),
        DB_PASSWORD:Joi.string().allow('').required(), // (3) boleh kosong
        DB_DATABASE:Joi.string().required(),
      })
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type:'mysql', // (4a) postgres -> mysql
        host: ConfigService.get<string>('DB_HOST'), // (4b) DB_USERNAME -> DB_HOST
        port: ConfigService.get<number>('DB_PORT'),
        username: ConfigService.get<string>('DB_USERNAME'),
        password: ConfigService.get<string>('DB_PASSWORD'),
        database: ConfigService.get<string>('DB_DATABASE'),

        autoLoadEntities: true,

        synchronize: ConfigService.get<string>('NODE_ENV' ) === 'development'
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(LogMiddlewareMiddleware)
    .forRoutes('*')
  }
}