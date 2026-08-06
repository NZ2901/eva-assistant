import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PersonalityModule } from '../personality/personality.module';

@Module({
  imports: [PersonalityModule],
  providers: [PromptService],
  exports: [PromptService],
})
export class PromptModule {}
