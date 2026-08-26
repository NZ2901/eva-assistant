import { Module } from '@nestjs/common';
import { PermanentMemoryModule } from '../permanent-memory/permanent-memory.module';
import { PromptService } from './prompt.service';
import { PersonalityModule } from '../personality/personality.module';

@Module({
  imports: [
    PersonalityModule,
    PermanentMemoryModule,
  ],
  providers: [PromptService],
  exports: [PromptService],
})
export class PromptModule {}
