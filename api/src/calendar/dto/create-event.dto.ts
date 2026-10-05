import {
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  summary!: string;

  @IsOptional()
  @IsString()
  @MaxLength(8192)
  description?: string;

  @IsISO8601({ strict: true })
  start!: string;

  @IsISO8601({ strict: true })
  end!: string;
}
