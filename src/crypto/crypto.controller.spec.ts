import { Test, TestingModule } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';

describe('CryptoController', () => {
  let app: INestApplication;
  let cryptoService: CryptoService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'PRIVATE_KEY':
            return 'mocked_private_key';
          case 'PUBLIC_KEY':
            return 'mocked_public_key';
          default:
            return null;
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoController],
      providers: [
        CryptoService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    })
      .overrideGuard(ValidationPipe)
      .useValue(new ValidationPipe({ transform: true }))
      .compile();

    cryptoService = module.get<CryptoService>(CryptoService);

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/get-encrypt-data', () => {
    it('should return encrypted data', async () => {
      // Mock the cryptoService methods

      jest
        .spyOn(cryptoService, 'generateAESKey')
        .mockReturnValue('mocked_aes_key');

      jest
        .spyOn(cryptoService, 'encryptWithAES')
        .mockReturnValue('mocked_encrypted_data2');

      jest
        .spyOn(cryptoService, 'encryptWithRSA')
        .mockReturnValue('mocked_encrypted_data1');

      const response = await request(app.getHttpServer())
        .post('/get-encrypt-data')
        .send({ payload: 'test_payload' })
        .expect(201);

      expect(response.body).toEqual({
        successful: true,
        error_code: null,
        data: {
          data1: 'mocked_encrypted_data1',
          data2: 'mocked_encrypted_data2',
        },
      });
    });

    it('should return 400 for missing payload', async () => {
      const response = await request(app.getHttpServer())
        .post('/get-encrypt-data')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'payload should not be empty',
          'payload must be longer than or equal to 1 characters',
          'payload must be a string',
        ],
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid payload length', async () => {
      const response = await request(app.getHttpServer())
        .post('/get-encrypt-data')
        .send({ payload: '' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'payload should not be empty',
          'payload must be longer than or equal to 1 characters',
        ],
        error: 'Bad Request',
      });
    });
  });
});
