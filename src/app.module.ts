import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection, ConnectionStates } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection: Connection) => {
          if (connection.readyState === ConnectionStates.connected) {
            console.log('Başarıyla MongoDB bağlantısı kuruldu');
          }
          connection.on('connected', () => {
            console.log('Başarıyla MongoDB bağlantısı kuruldu');
          });
          connection.on('error', (err) => {
            console.error('MongoDB bağlantı hatası:', err);
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
