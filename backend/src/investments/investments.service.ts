import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createInvestmentDto: CreateInvestmentDto, userId: string) {
    const { investmentName, investmentType, investedAmount, currentValue, purchaseDate } = createInvestmentDto;

    return this.prisma.investment.create({
      data: {
        userId,
        investmentName,
        investmentType,
        investedAmount,
        currentValue,
        purchaseDate: new Date(purchaseDate),
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.investment.findMany({
      where: { userId },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const investment = await this.prisma.investment.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID "${id}" not found`);
    }

    return investment;
  }

  async update(id: string, updateInvestmentDto: UpdateInvestmentDto, userId: string) {
    // Check existence and ownership first
    await this.findOne(id, userId);

    const { investmentName, investmentType, investedAmount, currentValue, purchaseDate } = updateInvestmentDto;

    return this.prisma.investment.update({
      where: { id },
      data: {
        ...(investmentName !== undefined && { investmentName }),
        ...(investmentType !== undefined && { investmentType }),
        ...(investedAmount !== undefined && { investedAmount }),
        ...(currentValue !== undefined && { currentValue }),
        ...(purchaseDate !== undefined && { purchaseDate: new Date(purchaseDate) }),
      },
    });
  }

  async remove(id: string, userId: string) {
    // Check existence and ownership first
    await this.findOne(id, userId);

    await this.prisma.investment.delete({
      where: { id },
    });

    return { message: 'Investment successfully removed' };
  }
}
