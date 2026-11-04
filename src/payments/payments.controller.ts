import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { Payment } from './entities/payments.entity.js';
import { CreatePaymentDto } from './dto/create-payments.dto.js';
import { UpdatePaymentStatusDto } from './dto/update-payments.dto.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<Payment[]> {
    return await this.paymentsService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentsService.simpanData(createPaymentDto);
  }

  // menampilkan data berdasarkan id
  @Get(':id')
  show(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  // mengupdate status pembayaran
  @Put(':id')
  updateData(@Param('id') id: string, @Body() updatePaymentStatusDto: UpdatePaymentStatusDto) {
    return this.paymentsService.updateData(id, updatePaymentStatusDto);
  }

  // menghapus data
  @Delete(':id')
  deleteData(@Param('id') id: string) {
    return this.paymentsService.deleteData(id);
  }
}