import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  async create(@Body() createInvestmentDto: CreateInvestmentDto, @GetUser('id') userId: string) {
    return this.investmentsService.create(createInvestmentDto, userId);
  }

  @Get()
  async findAll(@GetUser('id') userId: string) {
    return this.investmentsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser('id') userId: string) {
    return this.investmentsService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
    @GetUser('id') userId: string,
  ) {
    return this.investmentsService.update(id, updateInvestmentDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @GetUser('id') userId: string) {
    return this.investmentsService.remove(id, userId);
  }
}
