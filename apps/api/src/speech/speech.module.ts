import { Module } from '@nestjs/common';

import { SpeechController } from './speech.controller';
import { SpeechService } from './speech.service';
import { TextToSpeechNormalizer } from './text-to-speech-normalizer.service';

@Module({
  controllers: [SpeechController],
  providers: [SpeechService, TextToSpeechNormalizer],
  exports: [SpeechService],
})
export class SpeechModule {}
