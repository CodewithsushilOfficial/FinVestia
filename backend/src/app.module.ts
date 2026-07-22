import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InvestmentsModule } from './investments/investments.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [PrismaModule, AuthModule, InvestmentsModule, PortfolioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
