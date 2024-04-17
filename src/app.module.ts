import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptoService } from './crypto/crypto.service';
import { CryptoController } from './crypto/crypto.controller';

@Module({
  imports: [ConfigModule.forRoot(), ConfigModule],
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class AppModule {}
