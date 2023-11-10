import { Controller, Delete, Get, Ip, Param, Put } from '@nestjs/common';
import { RegisterServiceDto } from './register-service.dto';
import { RegisterService } from './register.service';

@Controller('')
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Put('/:name/:version/:port')
  register(@Param() params: RegisterServiceDto, @Ip() ip: string) {
    return this.registerService.register({ ...params }, ip);
  }

  @Delete('/:name/:version/:port')
  unregister(@Param() params: RegisterServiceDto, @Ip() ip: string) {
    return this.registerService.unregister({ ...params }, ip);
  }

  @Get(':name/:version')
  find(@Param() params: Partial<RegisterServiceDto>) {
    const { name, version } = params;
    return this.registerService.find(name, version);
  }
}
