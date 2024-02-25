import { Express, Router } from 'express';
import { create, deleteAll, deleteByID, findAll, findOne, update } from '../controllers/photo.controller';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), // 使用内存存储，文件将保存在内存中
  limits: { fileSize: 10 * 1024 * 1024 }, // 设置文件大小限制
});

const router = Router();

router.post('/', upload.single('building'), create);
router.get('/', findAll);
router.get('/:id', findOne);
router.put('/:id', update);
router.delete('/:id', deleteByID);
router.delete('/', deleteAll);

export function applyPhotoRoutes(app: Express): void {
  app.use('/api/photos', router);
}
