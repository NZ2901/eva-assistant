import { Injectable } from '@nestjs/common';
import { PersonalityService } from '../personality/personality.service';

@Injectable()
export class PromptService {
  constructor(
    private readonly personalityService: PersonalityService,
  ) {}

  build(): string {
    const personality = this.personalityService.build();

    return personality.systemPrompt;
  }
}
