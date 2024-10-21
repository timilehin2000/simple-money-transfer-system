import { Router, Request, Response } from 'express';
import userRoutes from './user.route';
import transferRoutes from './transfer.route';

const router: Router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.status(200).send('Welcome to simple transfer system API collection');
});

const routeVersion = '/api/v1';

router.use(`${routeVersion}/users`, userRoutes);

router.use(`${routeVersion}/transfers`, transferRoutes);

export default router;
