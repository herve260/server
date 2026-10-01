import { Router } from 'express';
import { listFeedback, createFeedback, createMessage } from '../controllers/feedback.controller.js';
const r = Router();
r.get('/', listFeedback);
r.post('/', createFeedback);
r.post('/messages', createMessage);
export default r;
//# sourceMappingURL=feedback.routes.js.map