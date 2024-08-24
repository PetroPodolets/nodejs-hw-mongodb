import express from 'express';
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { loginController, logoutController, refreshController, registerController, requestResetEmailController, resetPasswordController } from '../controllers/auth.js';
import { userLoginSchema, userRegisterSchema } from '../validation/user-shema.js';
import { requestResetEmailSchema, resetPasswordSchema } from '../validation/auth.js';


const authRouter = express.Router();

authRouter.post("/auth/register", validateBody(userRegisterSchema), ctrlWrapper(registerController));
authRouter.post('/auth/login', validateBody(userLoginSchema), loginController);
authRouter.post("/auth/refresh", ctrlWrapper(refreshController));
authRouter.post("/auth/logout", ctrlWrapper(logoutController));

authRouter.post('/auth/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));

authRouter.post('/auth/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
export default authRouter;
