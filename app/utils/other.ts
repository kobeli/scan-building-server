import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3ClientSingleton from './s3';
import { getJson } from 'serpapi';

export const recognizePhotoBySerpAPI = async (file: Express.Multer.File) => {
  // 设置S3上传参数
  const params = {
    Bucket: 'scanbuilding', // S3桶名
    Key: Date.now() + '_' + path.basename(file.originalname), // 文件名
    Body: file.buffer, // 文件内容
    ContentType: file.mimetype, // 文件类型
    // ACL: 'public-read' // 如果您希望该文件可以公开访问，请设置为 public-read
  };

  const keyName = Date.now() + '_' + path.basename(file.originalname)
  const command = new PutObjectCommand({
    Bucket: 'scanbuilding',
    Key: keyName, // 文件名
    Body: file.buffer,
  });

  try {
    const s3 = await s3ClientSingleton.getInstance();
    const uploadResult = await s3.send(command);
    console.log(uploadResult);
    const s3Url = `https://${'scanbuilding'}.s3.amazonaws.com/${encodeURIComponent(keyName)}`;
    const result = await getJson({
      engine: 'google_lens',
      api_key: '0fe2e55cbc9ca201746be8ed7b9f3f803dd12cbd0461100e599b458218bf897d',
      url: s3Url,
    });

    return {
      imageUrl: s3Url,
      content: !!result.knowledge_graph.length ? result.knowledge_graph[0] : {},
      status: result.search_metadata?.status ?? 'Error'
    };
  } catch (error) {
    console.error(error);
  }
  return undefined
}
