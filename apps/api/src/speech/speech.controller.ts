import { Body, Controller, Post, Req, Res } from '@nestjs/common';

import type { Request, Response } from 'express';

import { SpeechDto } from './dto/speech.dto';
import { SpeechService } from './speech.service';

@Controller('speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post()
  async speech(
    @Body() body: SpeechDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const abortController = new AbortController();
    const abort = () => abortController.abort();
    request.once('aborted', abort);

    try {
      const audio = await this.speechService.generateSpeech(
        body.text,
        abortController.signal,
      );

      response.setHeader('Content-Type', 'audio/wav');

      response.setHeader('Content-Length', audio.length);

      response.setHeader('Cache-Control', 'no-cache');

      response.send(audio);
    } catch (error) {
      console.error('Erro ao gerar voz:', error);

      if (!response.headersSent) {
        response.status(500).json({
          message: 'Erro ao gerar voz.',
        });
      }
    } finally {
      request.removeListener('aborted', abort);
    }
  }
}
