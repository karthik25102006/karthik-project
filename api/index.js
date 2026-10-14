import { createApiMiddleware } from '../server/apiRouter.js';

const apiHandler = createApiMiddleware();

export default async function handler(req, res) {
  return apiHandler(req, res);
}
