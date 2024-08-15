import { Router } from "express";
import { addContactController, deleteContactController, getAllContactsController, getContactByIdController, patchContactController } from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { contactAddSchema, contactUpdateSchema } from "../validation/validationSchema.js";
import { isValidId } from "../middlewares/isValid.js";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";


const router = Router();

router.use(authenticate);


router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post("/contacts", upload.single("photo"), validateBody(contactAddSchema), ctrlWrapper(addContactController));
router.patch("/contacts/:contactId", upload.single("photo"), isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContactController));
router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));




export default router;
