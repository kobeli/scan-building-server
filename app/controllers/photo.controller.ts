import { Request, Response } from 'express';
import { db } from '../models';
import { recognizePhotoBySerpAPI } from '../utils/other';

const Photo = db.photos;
// @ts-ignore
const Op = db.Sequelize.Op;

// 创建并保存一条记录
export const create = (req: Request, res: Response): void => {
  // 验证请求
  const file = req.file;
  if (!file) {
    res.status(400).send('请上传文件。');
    return;
  }
  recognizePhotoBySerpAPI(file).then((data: any) => {
    console.log('recognizePhotoBySerpAPI', data);
    const photo: any = {
      type: 'building',
      name: file.originalname,
      url: data.imageUrl,
    };

    Photo.create(photo)
      .then(() => {
        res.send(data.searchJson);
      })
      .catch((err: { message: any; }) => {
        res.status(500).send({
          message: err.message || '创建记录时发生错误。'
        });
      });
  })
};

// 从数据库中搜索.
export const findAll = (req: Request, res: Response) => {
  const name = req.query.title;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Photo.findAll({ where: condition })
    .then((data: any) => {
      res.send(data);
    })
    .catch((err: { message: any; }) => {
      res.status(500).send({
        message:
          err.message || '搜索时，发生错误。'
      });
    });
};

// 按照条目 ID 搜索
export const findOne = (req: Request, res: Response) => {
  const id = req.params.id;

  Photo.findByPk(id)
    .then((data: any) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `没有找到 ${id} 的清单`
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `查询第 ${id} 条清单时出错`
      });
    });
};

// 更新指定 ID 清单
export const update = (req: Request, res: Response) => {
  const id = req.params.id;

  Photo.update(req.body, {
    where: { id: id }
  })
    .then((num: number) => {
      if (num == 1) {
        res.send({
          message: '更新成功'
        });
      } else {
        res.send({
          message: `第 ${id} 条更新失败。`
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `更新第 ${id} 条清单时出错`
      });
    });
};

// Delete a Todo with the specified id in the request
export const deleteByID = (req: Request, res: Response) => {
  const id = req.params.id;

  Photo.destroy({
    where: { id: id }
  })
    .then((num: number) => {
      if (num == 1) {
        res.send({
          message: '删除成功'
        });
      } else {
        res.send({
          message: `删除第${id}条清单失败。`
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: '不能删除清单：' + id
      });
    });
};

// 删除数据库中所有清单
export const deleteAll = (req: Request, res: Response) => {
  Photo.destroy({
    where: {},
    truncate: false
  })
    .then((nums: any) => {
      res.send({ message: `删除${nums}条清单 ` });
    })
    .catch((err: { message: any; }) => {
      res.status(500).send({
        message:
          err.message || '删除所有清单时出错'
      });
    });
};
