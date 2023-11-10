import { Module } from '@nestjs/common';
import { RegisterController } from './registry/register.controller';
import { RegisterService } from './registry/register.service';
@Module({
  imports: [],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class AppModule {}
