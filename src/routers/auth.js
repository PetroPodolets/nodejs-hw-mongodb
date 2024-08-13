import express from 'express';
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { loginController, logoutController, refreshController, registerController } from '../controllers/auth.js';
import { userLoginSchema, userRegisterSchema } from '../validation/user-shema.js';


const authRouter = express.Router();

authRouter.post("/auth/register", validateBody(userRegisterSchema), ctrlWrapper(registerController));
authRouter.post('/auth/login', validateBody(userLoginSchema), loginController);
authRouter.post("/auth/refresh", ctrlWrapper(refreshController));
authRouter.post("/auth/logout", ctrlWrapper(logoutController));

export default authRouter;
