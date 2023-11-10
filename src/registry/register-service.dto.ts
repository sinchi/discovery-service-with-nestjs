import { IsPort, IsSemVer, IsString } from 'class-validator';

export class RegisterServiceDto {
  @IsString()
  name: string;
  @IsSemVer()
  version: string;
  @IsPort()
  port: number;
}
