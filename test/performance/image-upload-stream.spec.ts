import axios from 'axios';
import api from '../../src/api';
import * as FormData from 'form-data';
import * as sharp from 'sharp';

const host = 'http://localhost:3001';
jest.setTimeout(300000); // Increase timeout for a large number of requests

describe('ImagesController (e2e)', () => {
  let accessToken: string = '';

  beforeAll(async () => {
    const ret = await api.functional.api_conventions.create_admin_access_token.createAdminAccessToken({
      host,
    });
    accessToken = ret.adminAccessTokens[0].accessToken;
  });

  const sendUploadRequest = async (): Promise<any[]> => {
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

    // Create a FormData object and append the dummy image
    const formData = new FormData();
    formData.append('file', buffer, { filename: 'test.jpg', contentType: 'image/jpeg' });

    const response = await axios.post(`${host}/user/images/upload`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    expect(response.status).toBe(201);
    return response.data;
  };

  it('should handle multiple concurrent upload requests', async () => {
    const numberOfRequests = 200;

    const promises: Promise<any>[] = [];
    const startTime = Date.now();

    for (let i = 0; i < numberOfRequests; i++) {
      promises.push(sendUploadRequest());
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();

    const totalTime = (endTime - startTime) / 1000; // in seconds
    const averageTime = totalTime / numberOfRequests;

    console.log(`Total time for ${numberOfRequests} uploads: ${totalTime} seconds`);
    console.log(`Average time per upload: ${averageTime} seconds`);
    console.log(`Successfully uploaded ${results.length} files`);
  });
});
