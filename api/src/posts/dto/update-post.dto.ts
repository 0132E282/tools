import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto.js';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsNumber()
  id?: number;
}
