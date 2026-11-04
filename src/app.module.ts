import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BooksModule } from './books/books.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { LogMiddlewareMiddleware } from './middleware/log-middleware/log-middleware.middleware.js';
import { UsersModule } from './users/users.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { CustomersAddressesModule } from './customers_addresses/customers_addresses.module.js';
import { PublishersModule } from './publishers/publishers.module.js';
import { AuthorsModule } from './authors/authors.module.js';
import { BookAuthorsModule } from './book_authors/book_authors.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { OrdersItemsModule } from './orders_items/orders_items.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { ShipmentsModule } from './shipments/shipments.module.js';

@Module({
  imports: [
    BooksModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().valid('development','staging','production').default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME:Joi.string().required(),
        DB_PASSWORD:Joi.string().allow('').required(),
        DB_DATABASE:Joi.string().required(),
      })
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type:'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),

        autoLoadEntities: true,

        synchronize: config.get<string>('NODE_ENV') === 'development'
      })
    }),

    UsersModule,

    CategoriesModule,

    CustomersModule,

    CustomersAddressesModule,

    PublishersModule,

    AuthorsModule,

    BookAuthorsModule,

    OrdersModule,

    OrdersItemsModule,

    PaymentsModule,

    ShipmentsModule
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