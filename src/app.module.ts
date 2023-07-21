import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevicesModule } from './devices/devices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MachinesModule } from './machines/machines.module';
import { FactoryplansModule } from './factoryplans/factoryplans.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password123',
      database: 'zms',
      autoLoadEntities: true,
      synchronize: true
    }),
    DevicesModule,
    ScheduleModule.forRoot(),
    MachinesModule,
    FactoryplansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
