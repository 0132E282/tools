import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Param,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { Post as PostEntity } from './post.entity.js';
import { PostsService } from './posts.service.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get(['', 'list'])
  findAllGet(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Post(['', 'list'])
  @HttpCode(HttpStatus.OK)
  findAllPost(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get([':id', 'detail', 'detail/:id'])
  findOneGet(
    @Body('id') bodyId?: number | string,
    @Param('id') paramId?: string,
  ): Promise<PostEntity> {
    return this.findOne(bodyId, paramId);
  }

  @Post(['detail', 'detail/:id'])
  @HttpCode(HttpStatus.OK)
  findOne(
    @Body('id') bodyId?: number | string,
    @Param('id') paramId?: string,
  ): Promise<PostEntity> {
    const rawId = bodyId ?? paramId;
    const id = Number(rawId);
    if (!rawId || Number.isNaN(id)) {
      throw new BadRequestException('Invalid or missing post id');
    }
    return this.postsService.findOne(id);
  }

  @Post(['update', 'update/:id'])
  @HttpCode(HttpStatus.OK)
  update(
    @Body() updatePostDto: UpdatePostDto,
    @Param('id') paramId?: string,
  ): Promise<PostEntity> {
    const rawId = updatePostDto.id ?? paramId;
    const id = Number(rawId);
    if (!rawId || Number.isNaN(id)) {
      throw new BadRequestException('Invalid or missing post id');
    }
    return this.postsService.update(id, updatePostDto);
  }

  @Post(['delete', 'delete/:id'])
  @HttpCode(HttpStatus.OK)
  async remove(
    @Body('id') bodyId?: number | string,
    @Param('id') paramId?: string,
  ): Promise<{ success: boolean }> {
    const rawId = bodyId ?? paramId;
    const id = Number(rawId);
    if (!rawId || Number.isNaN(id)) {
      throw new BadRequestException('Invalid or missing post id');
    }
    await this.postsService.remove(id);
    return { success: true };
  }
}
