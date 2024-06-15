import axios from 'axios';
import api from '../../src/api';
import * as FormData from 'form-data';
import * as sharp from 'sharp';

const host = 'http://localhost:3001';
const minioHost = 'http://localhost:9000/najuha-v2-bucket';

// Increase timeout for a large number of requests
jest.setTimeout(300000);

describe('ImagesController (e2e)', () => {
  let accessToken: string = '';

  beforeAll(async () => {
    const ret = await api.functional.api_conventions.create_admin_access_token.createAdminAccessToken({
      host,
    });
    accessToken = ret.adminAccessTokens[0].accessToken;
  });

  const createImageAndUpload = async (): Promise<void> => {
    const response = await axios.post(
      `${host}/user/images`,
      {
        format: 'image/jpeg',
        path: 'competition',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { image, presignedPost } = response.data.result;
    const { fields } = presignedPost;

    if (!fields) {
      throw new Error('Fields are missing from the presigned URL response.');
    }

    // Create a dummy image using sharp 5MB
    const buffer = await sharp({
      create: {
        width: 5000,
        height: 5000,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .jpeg()
      .toBuffer();

    // Create a FormData object and append fields and file
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', buffer, { filename: 'test.jpg', contentType: 'image/jpeg' });

    try {
      await axios.post(minioHost, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
    } catch (error) {
      console.error('Upload Error:', error);
    }
  };

  it('should handle multiple concurrent createImage and upload requests', async () => {
    const numberOfRequests = 200;

    const promises: Promise<void>[] = [];
    const startTime = Date.now();

    for (let i = 0; i < numberOfRequests; i++) {
      promises.push(createImageAndUpload());
    }

    await Promise.all(promises)
      .then((results) => {
        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000; // in seconds
        const averageTime = totalTime / numberOfRequests;

        console.log(`Total time for ${numberOfRequests} uploads: ${totalTime} seconds`);
        console.log(`Average time per upload: ${averageTime} seconds`);
        console.log(`Successfully uploaded ${results.length} files`);
      })
      .catch((error) => {
        console.error('Error during uploads:', error);
      });
  });
});
