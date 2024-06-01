import typia, { tags } from 'typia';
import api from '../../src/api';
import { CreatePostReqBody } from 'src/modules/posts/presentation/posts.presentation.dto';

const host = 'http://localhost:3001';
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMThmN2QzNC1jZmMzLTc4MjEtOGJiNC1iNGI1NjE3OWVmY2QiLCJ1c2VyUm9sZSI6IkFETUlOIiwiaWF0IjoxNzE3MjU1MDY5LCJleHAiOjE3MzAyMTUwNjl9.Romr3tia2V55hxZTPrfgA41h-VKZCp4ZRgG9zBgNYsQ';
const connection = {
  host,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
};

jest.setTimeout(30000);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createDummyPosts10000 = () => {
  const batchSize = 100; // 한 번에 보낼 요청의 수
  const totalRequests = 10000;
  const delayBetweenBatches = 500; // 배치 사이의 딜레이 (밀리초)
  let currentBatch: Promise<any>[] = [];
  for (let i = 0; i < totalRequests; i++) {
    currentBatch.push(api.functional.user.posts.createPost(connection, typia.random<CreatePostReqBody>()));
    if (currentBatch.length === batchSize) {
      Promise.all(currentBatch);
      currentBatch = []; // 배치 초기화
      sleep(delayBetweenBatches); // 딜레이 추가
    }
  }
  // 남아있는 요청 처리
  if (currentBatch.length > 0) {
    Promise.all(currentBatch);
  }
};

describe('UserPostsController (e2e)', () => {
  it('/user/posts (POST) - createPost 100000', async () => {
    // createDummyPosts10000();
  });

  it('/user/posts (get) - findPosts 100', async () => {
    console.time('findPosts 100');
    for (let i = 0; i < 100; i++) {
      await api.functional.user.posts.findPosts(connection, {
        page: typia.random<number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<100>>(),
        limit: 30,
      });
    }
    console.timeEnd('findPosts 100');
  });
});
