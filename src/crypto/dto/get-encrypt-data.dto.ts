import { IsString, Length, IsNotEmpty } from 'class-validator';

export class GetEncryptDataDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  payload: string;
}
