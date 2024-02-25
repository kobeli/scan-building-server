import { S3Client } from '@aws-sdk/client-s3';
import { getAccessKey } from './accessManager';

class S3ClientSingleton {
  private static instance: S3Client;

  // 私有构造函数，防止外部使用new关键字创建实例
  private constructor() {
  }

  // 静态方法用于获取S3Client的实例
  public static async getInstance(): Promise<S3Client> {
    if (!this.instance) {
      const data = await getAccessKey();
      this.instance = new S3Client({
        region: 'ap-southeast-1',
        credentials: {
          accessKeyId: data.accessKeyId,
          secretAccessKey: data.secretAccessKey,
        },
      });
    }
    return this.instance;
  }
}

export default S3ClientSingleton;
