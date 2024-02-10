import { Express, Router } from 'express';
import { create, deleteAll, deleteByID, findAll, findOne, update } from '../controllers/photo.controller';

const router = Router();

router.post('/', create);
router.get('/', findAll);
router.get('/:id', findOne);
router.put('/:id', update);
router.delete('/:id', deleteByID);
router.delete('/', deleteAll);

export function applyPhotoRoutes(app: Express): void {
  app.use('/api/photos', router);
}
