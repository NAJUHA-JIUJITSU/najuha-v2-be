import { CreatePostReqBody } from 'src/modules/posts/presentation/posts.presentation.dto';
import api from '../../src/api';
import typia from 'typia';

const host = 'http://localhost:3001';

jest.setTimeout(30000);

describe('UserPostsController (e2e)', () => {
  let accessToken: string = ''; // Assign an initial value to 'accessToken'

  let connection = {
    host,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let dummyPost: any = {};

  beforeAll(async () => {
    const accessTokenRet = await api.functional.api_conventions.create_admin_access_token.createAdminAccessToken({
      host,
    });
    if (accessTokenRet['status'] === 201) {
      accessToken = accessTokenRet['data']['accessToken'];
    }

    const dummyPostRet = await api.functional.user.posts.createPost(connection, typia.random<CreatePostReqBody>());
    if (dummyPostRet['status'] === 201) {
      dummyPost = dummyPostRet.data.result.post;
    }
  });

  it('/public-api/vew-count/post/:postId concurrency test', async () => {
    const postId = dummyPost['data']['id'];
    const concurrency = 100;
    const promises = Array(concurrency)
      .fill(0)
      .map(() => {
        return api.functional.public_api.view_count.post.incrementPostViewCount(connection, postId);
      });

    console.time('incrementPostViewCount concurrency test');
    await Promise.all(promises);
    console.timeEnd('incrementPostViewCount concurrency test');
  });
});
