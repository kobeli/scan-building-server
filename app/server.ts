import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as process from 'process';

// 根据 NODE_ENV 加载对应的 .env 文件
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? 'production.env' : 'development.env'
});

import { applyPhotoRoutes } from './routes/photo.routes';
// import { db } from './models';
import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';
import { getJson } from 'serpapi';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const app = express();

// content-type：application/json
app.use(bodyParser.json());

// content-type：application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// 简单路由
app.get('/', (req, res) => {
  res.json({ message: '欢迎访问卡拉云后端服务器' });
});

// 配置 Multer
const upload = multer({
  storage: multer.memoryStorage(), // 使用内存存储，文件将保存在内存中
  limits: { fileSize: 10 * 1024 * 1024 }, // 设置文件大小限制
});

// 设置路由以处理文件上传
app.post('/upload', upload.single('building'), function (req, res: any) {
  const file = req.file;
  if (!file) {
    return res.status(400).send('请上传文件。');
  }

  // 设置S3上传参数
  const params = {
    Bucket: 'scanbuilding', // S3桶名
    Key: Date.now() + '_' + path.basename(file.originalname), // 文件名
    Body: file.buffer, // 文件内容
    ContentType: file.mimetype, // 文件类型
    // ACL: 'public-read' // 如果您希望该文件可以公开访问，请设置为 public-read
  };

  // 上传文件到S3
  const s3 = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
      accessKeyId: 'AKIAQ3EGQXMPD5U3VQCC',
      secretAccessKey: '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'
    },
  });
  const keyName = Date.now() + '_' + path.basename(file.originalname)
  const command = new PutObjectCommand({
    Bucket: "scanbuilding",
    Key: keyName, // 文件名
    Body: file.buffer,
  });

  s3.send(command).then((response) => {
    const s3Url = `https://${'scanbuilding'}.s3.amazonaws.com/${encodeURIComponent(keyName)}`;
    getJson({
      engine: "google_lens",
      api_key: '0fe2e55cbc9ca201746be8ed7b9f3f803dd12cbd0461100e599b458218bf897d', // Get your API_KEY from https://serpapi.com/manage-api-key
      url: s3Url,
    }, (json) => {
      console.log(json);
      res.send({ url: (json['knowledge_graph']) });
    });
  });

  //
  // s3.upload(params, function (err: Error, data: SendData) {
  //   if (err) {
  //     console.error('上传到S3出错: ', err);
  //     return res.status(500).send('上传文件出错。');
  //   }
  //   // 成功上传到S3后，返回URL
  //   const s3AddressUrl = data.Location;
  //   if (!!s3AddressUrl) {
  //     getJson({
  //       engine: "google_lens",
  //       api_key: '0fe2e55cbc9ca201746be8ed7b9f3f803dd12cbd0461100e599b458218bf897d', // Get your API_KEY from https://serpapi.com/manage-api-key
  //       url: s3AddressUrl,
  //     }, (json) => {
  //       console.log(json);
  //       res.send({ url: (json['knowledge_graph']) });
  //     });
  //   }
  // });
});


app.get('/form', function (req, res, next) {
  const form = fs.readFileSync(path.join(__dirname, 'form.html'), { encoding: 'utf8' });
  res.send(form);
});

applyPhotoRoutes(app);

// 设置监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行端口： ${PORT}.`);
});

// db.sequelize.sync();
