import { IsString, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEncryptDataDto {
  @ApiProperty({
    description: 'Payload to encrypt',
    minLength: 1,
    maxLength: 2000,
    required: true,
  })
  @IsString()
  @Length(1, 2000)
  @IsNotEmpty()
  payload: string;
}
