import { configureApp } from './../src/configure-app.js';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppController } from './../src/app.controller.js';
import { AppService } from './../src/app.service.js';
import { Post } from './../src/posts/post.entity.js';
import { PostsController } from './../src/posts/posts.controller.js';
import { PostsService } from './../src/posts/posts.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let posts: Post[];
  let nextId: number;

  beforeEach(async () => {
    posts = [];
    nextId = 1;
    const postsRepository = {
      create: (values: Partial<Post>) => Object.assign(new Post(), values),
      save: async (post: Post) => {
        const now = new Date();
        const savedPost = Object.assign(new Post(), post, {
          id: post.id ?? nextId++,
          content: post.content ?? null,
          status: post.status ?? 'draft',
          createdAt: post.createdAt ?? now,
          updatedAt: now,
        });
        const index = posts.findIndex(({ id }) => id === savedPost.id);
        if (index < 0) {
          posts.push(savedPost);
        } else {
          posts[index] = savedPost;
        }
        return savedPost;
      },
      find: async () => [...posts],
      findOneBy: async ({ id }: Partial<Post>) =>
        posts.find((post) => post.id === id) ?? null,
      remove: async (post: Post) => {
        posts = posts.filter(({ id }) => id !== post.id);
        return post;
      },
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, PostsController],
      providers: [
        AppService,
        PostsService,
        { provide: getRepositoryToken(Post), useValue: postsRepository },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  it('keeps unknown API routes in the backend', () => {
    return request(app.getHttpServer()).get('/api/missing').expect(404);
  });

  it('supports creating, reading, updating, and deleting posts via POST endpoints', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/posts/create')
      .send({ title: 'First Post', content: 'Hello World', status: 'published' })
      .expect(201);

    const createdBody: unknown = createResponse.body;
    if (
      typeof createdBody !== 'object' ||
      createdBody === null ||
      !('id' in createdBody) ||
      typeof createdBody.id !== 'number'
    ) {
      throw new Error('Create response did not include a numeric post id');
    }
    const { id } = createdBody;

    await request(app.getHttpServer())
      .post('/api/posts/list')
      .expect(200)
      .expect(({ body }) => expect(body).toEqual([createResponse.body]));

    await request(app.getHttpServer())
      .post('/api/posts/detail')
      .send({ id })
      .expect(200)
      .expect(({ body }) => expect(body.title).toBe('First Post'));

    await request(app.getHttpServer())
      .post('/api/posts/update')
      .send({ id, title: 'Updated Post' })
      .expect(200)
      .expect(({ body }) => expect(body.title).toBe('Updated Post'));

    await request(app.getHttpServer())
      .post('/api/posts/delete')
      .send({ id })
      .expect(200)
      .expect(({ body }) => expect(body.success).toBe(true));

    await request(app.getHttpServer())
      .post('/api/posts/detail')
      .send({ id })
      .expect(404);
  });

  it('rejects posts without a valid title', () => {
    return request(app.getHttpServer())
      .post('/api/posts/create')
      .send({ title: '' })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
