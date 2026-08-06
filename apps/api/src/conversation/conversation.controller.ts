import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { ChatDto } from './dto/chat.dto';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
  ) {}

  @Post()
  async chat(
    @Body() body: ChatDto,
  ) {
    const response =
      await this.conversationService.chat(
        body.message,
      );

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
        const chunk of this.conversationService.stream(
          body.message,
        )
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