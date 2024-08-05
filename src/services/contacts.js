import { contactColection } from "../db/models/contact.js";

export const getAllContacts = async () => {
    const constacts = await contactColection.find();
    return constacts;

}

export const getContactById = async (contact) => {
    const constact = await contactColection.findById(contact);
    return constact;
}

export const addContact = contact => contactColection.create(contact);

export const patchContact = async (id, data, options = {}) => {
    try {
        console.log("Updating contact with ID:", id, "and data:", data);
        const result = await contactColection.findOneAndUpdate(
            { _id: id }, // фільтр за _id
            data,
            {
                new: true,
                ...options,
            }
        );

        console.log("Update result:", result);

        if (!result) return null;

        return {
            data: result,
            isNew: false, // оновлення не викликає upsert
        }
    } catch (error) {
        console.error("Error in patchContact:", error);
        throw error;
    }
}

export const deleteContact = async (contactId) => {
    try {
        // Використовуйте contactId без обгортки у об'єкт
        const contact = await contactColection.findByIdAndDelete(contactId);
        return contact; // Повертає видалений документ або null
    } catch (error) {
        console.error("Error in deleteContact:", error);
        throw error; // Проброс помилки далі
    }
}
