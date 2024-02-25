import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as process from 'process';
// 根据 NODE_ENV 加载对应的 .env 文件
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? 'production.env' : 'development.env'
});
import { applyPhotoRoutes } from './routes/photo.routes';
import { db } from './models';
import * as fs from 'fs';
import * as path from 'path';

const app = express();

// content-type：application/json
app.use(bodyParser.json());

// content-type：application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// 简单路由
app.get('/', (req, res) => {
  res.json({ message: 'Scan-building server' });
});

app.get('/form', function (req, res, next) {
  res.send('<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head><title>File Upload</title></head>\n' +
    '<body><h2>Upload File</h2>\n' +
    '<form action="/api/photos" method="post" enctype="multipart/form-data"><input type="file" name="building"/><input\n' +
    '        type="submit" value="Upload Image" name="submit"></form>\n' +
    '</body>\n' +
    '</html>\n');
});

applyPhotoRoutes(app);

// 设置监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行端口： ${PORT}.`);
});

db.sequelize.sync();
