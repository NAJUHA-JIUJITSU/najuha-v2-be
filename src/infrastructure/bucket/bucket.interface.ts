export interface GetPresignedPostUrlParam {
  path: string;
  key: string;
  format: string;
  expiresIn: number;
  maxSize: number;
}

/**
 * Presigned Post
 *
 * url: The URL to which the file should be uploaded.
 * - 클라이언트는 이 URL로 파일을 업로드합니다. 이 URL은 S3 버킷이나 S3 호환 스토리지(MinIO 등)의 엔드포인트를 포함합니다.
 * - 예를 들어, 클라이언트는 이 URL을 사용하여 `fetch`나 `axios` 등의 HTTP 클라이언트 라이브러리를 통해 파일을 업로드할 수 있습니다.
 *
 *
 * fields: A set of fields that must be included in the form-data when uploading the file.
 * - 클라이언트는 파일 업로드 요청 시 이 필드들을 포함해야 합니다. 이 필드들은 presigned POST 요청의 조건을 만족시키기 위해 필요합니다.
 * - 클라이언트는 `FormData` 객체를 생성하고, 각 필드를 `FormData`에 추가한 후, 파일과 함께 서버로 전송합니다.
 * - 예시:
 * ```javascript
 * const formData = new FormData();
 * Object.entries(fields).forEach(([key, value]) => {
 *   formData.append(key, value);
 * });
 * formData.append('file', file);
 *
 * const response = await fetch(url, {
 *   method: 'POST',
 *   body: formData,
 * });
 */
export interface TPresignedPost {
  url: string;
  fields: Record<string, string>;
}
