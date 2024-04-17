import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  privateKey: string;
  publicKey: string;

  constructor(private configService: ConfigService) {
    this.privateKey = this.configService.get<string>('PRIVATE_KEY');
    this.publicKey = this.configService.get<string>('PUBLIC_KEY');
  }

  generateAESKey(): string {
    return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  }

  encryptWithAES(payload: string, key: string): string {
    const encryptedPayload = CryptoJS.AES.encrypt(payload, key).toString();
    return encryptedPayload;
  }

  decryptWithAES(data: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(data, key);
    const decryptedPayload = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPayload;
  }

  encryptWithRSA(payload: string): string {
    const encryptedPayload = CryptoJS.AES.encrypt(
      payload,
      this.privateKey,
    ).toString();
    return encryptedPayload;
  }

  decryptWithRSA(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, this.privateKey);
    const decryptedPayload = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPayload;
  }
}
