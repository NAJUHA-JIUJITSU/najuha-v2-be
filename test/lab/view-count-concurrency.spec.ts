import { CreatePostReqBody } from '../../src/modules/posts/presentation/posts.controller.dto';
import api from '../../src/api';
import typia from 'typia';

const host = 'http://localhost:3001';

jest.setTimeout(300000); // Increase timeout for a large number of requests

describe('UserPostsController (e2e)', () => {
  let accessToken: string = '';

  let dummyPost: any = {};

  beforeAll(async () => {
    const accessTokenRet = await api.functional.api_conventions.create_admin_access_token.createAdminAccessToken({
      host,
    });
    if (accessTokenRet.status === 201) {
      accessToken = accessTokenRet.data[0].accessToken;
      console.log(`Access token: ${accessToken}`);
    }

    const dummyPostRet = await api.functional.user.posts.createPost(
      {
        host,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      typia.random<CreatePostReqBody>(),
    );
    if (dummyPostRet.status === 201) {
      dummyPost = dummyPostRet.data.result.post;
    }
  });

  it('/public-api/view-count/post/:postId concurrency test', async () => {
    const postId = dummyPost.id;
    const concurrency = 100;
    const totalRequests = 1000;
    const batches = Math.ceil(totalRequests / concurrency);

    console.time('incrementPostViewCount total concurrency test');

    for (let i = 0; i < batches; i++) {
      const promises = Array(concurrency)
        .fill(0)
        .map(async () => {
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
          return api.functional.user.view_count.post.incrementPostViewCount(
            {
              host,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
            postId,
          );
        });
      await Promise.all(promises);
    }

    console.timeEnd('incrementPostViewCount total concurrency test');

    // Fetch the updated view count
    const updatedPostRet = await api.functional.user.posts.getPost(
      {
        host,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      postId,
    );
    if (updatedPostRet.status === 200) {
      const updatedViewCount = updatedPostRet.data.result.post.viewCount;
      console.log(`Updated view count: ${updatedViewCount}`);
      console.log(JSON.stringify(updatedPostRet.data.result.post, null, 2));
    } else {
      console.error('Failed to retrieve updated post view count.');
    }
  });
});
