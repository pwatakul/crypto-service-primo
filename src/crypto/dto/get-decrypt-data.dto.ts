import { IsString, IsNotEmpty } from 'class-validator';

export class GetDecryptDataDto {
  @IsString()
  @IsNotEmpty()
  data1: string;

  @IsString()
  @IsNotEmpty()
  data2: string;
}
