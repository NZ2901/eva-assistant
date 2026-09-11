import {
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SpeechDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  text: string;
}