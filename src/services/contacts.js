import { ContactColection } from "../db/models/contact.js";

export const getAllContacts = async () => {
    const constacts = await ContactColection.find();
    return constacts;

}

export const getContactById = async (contact) => {
    const constact = await ContactColection.findById(contact);
    return constact;
}
