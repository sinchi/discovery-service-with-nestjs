import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterServiceDto {
  name: string;
  version: string;
  port: number;
}
