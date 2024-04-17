import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { GetEncryptDataDto } from './dto/get-encrypt-data.dto';
import { GetDecryptDataDto } from './dto/get-decrypt-data.dto';

@Controller()
@ApiTags('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('/get-encrypt-data')
  @ApiBody({
    description: 'Payload to encrypt',
    schema: {
      type: 'object',
      properties: {
        payload: {
          type: 'string',
          description: 'Payload to encrypt',
          minLength: 1,
          maxLength: 2000,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully encrypted data',
    schema: {
      type: 'object',
      example: {
        successful: true,
        error_code: null,
        data: {
          data1: 'encrypted_data1',
          data2: 'encrypted_data2',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  getEncryptData(@Body() getEncryptDataDto: GetEncryptDataDto) {
    const payload: string = getEncryptDataDto.payload;

    const aesKey = this.cryptoService.generateAESKey();
    const encryptedData2 = this.cryptoService.encryptWithAES(payload, aesKey);
    const encryptedData1 = this.cryptoService.encryptWithRSA(aesKey);

    return {
      successful: true,
      error_code: null,
      data: {
        data1: encryptedData1,
        data2: encryptedData2,
      },
    };
  }

  @Post('/get-decrypt-data')
  @ApiBody({
    description: 'Data to decrypt',
    schema: {
      type: 'object',
      required: ['data1', 'data2'],
      properties: {
        data1: {
          type: 'string',
          description: 'Encrypted AES key',
        },
        data2: {
          type: 'string',
          description: 'Encrypted payload',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully decrypted data',
    schema: {
      type: 'object',
      example: {
        successful: true,
        error_code: null,
        data: {
          payload: 'payload_string',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  getDecryptData(@Body() getDecryptDataDto: GetDecryptDataDto) {
    const data1: string = getDecryptDataDto.data1;
    const data2: string = getDecryptDataDto.data2;

    const aesKey = this.cryptoService.decryptWithRSA(data1);
    const decryptedPayload = this.cryptoService.decryptWithAES(data2, aesKey);

    return {
      successful: true,
      error_code: null,
      data: {
        payload: decryptedPayload,
      },
    };
  }
}
