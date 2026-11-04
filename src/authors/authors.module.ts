import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsController } from './authors.controller.js';
import { AuthorsService } from './authors.service.js';
import { Author } from './entities/authors.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService, TypeOrmModule],
})
export class AuthorsModule {}