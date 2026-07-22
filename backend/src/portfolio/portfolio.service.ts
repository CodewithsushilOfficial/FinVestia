import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string) {
    const investments = await this.prisma.investment.findMany({
      where: { userId },
    });

    let totalInvested = 0;
    let currentValue = 0;

    for (const inv of investments) {
      totalInvested += Number(inv.investedAmount);
      currentValue += Number(inv.currentValue);
    }

    const profit = currentValue - totalInvested;
    const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

    return {
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      currentValue: parseFloat(currentValue.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      profitPercentage: parseFloat(profitPercentage.toFixed(2)),
    };
  }
}
