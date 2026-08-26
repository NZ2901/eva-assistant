import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { BrainService } from '../brain/brain.service';
import { ChatDto } from './dto/chat.dto';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly brainService: BrainService,
  ) {}

  @Post()
  async chat(
    @Body() body: ChatDto,
  ) {
    const response =
      await this.brainService.chat(body);

    return {
      message: response,
    };
  }

  @Post('stream')
  async stream(
    @Body() body: ChatDto,
    @Res() response: Response,
  ) {
    response.setHeader(
      'Content-Type',
      'text/plain; charset=utf-8',
    );

    response.setHeader(
      'Transfer-Encoding',
      'chunked',
    );

    response.setHeader(
      'Cache-Control',
      'no-cache',
    );

    response.setHeader(
      'Connection',
      'keep-alive',
    );

    try {
      for await (
        const chunk of this.brainService.stream(body)
      ) {
        response.write(chunk);
      }

      response.end();
    } catch (error) {
      console.error(error);

      if (!response.headersSent) {
        response.status(500);
      }

      response.end('Erro ao gerar resposta.');
    }
  }
}
