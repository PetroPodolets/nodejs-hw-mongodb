import { contactFieldList, sortOrderList } from "../constants/index.js";
import { contactColection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({ page, perPage, sortBy = contactFieldList[0], sortOrder = sortOrderList[0], filter }) => {
    const skip = (page - 1) * perPage;

    const databaseQuery = contactColection.find();

    if (filter.contactType) {
        databaseQuery.where("contactType").equals(filter.contactType);
    }

    if (filter.isFavourite != null) {
        databaseQuery.where("isFavourite").equals(filter.isFavourite);
    }

    const [totalItems, data] = await Promise.all([
        contactColection.find().merge(databaseQuery).countDocuments(),

        databaseQuery
            .skip(skip)
            .limit(perPage)
            .sort({ [sortBy]: sortOrder })
            .exec(),
    ]);

    const { totalPages, hasNextPages, hasPreviousPages } = calculatePaginationData({ total: totalItems, page, perPage })

    return {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPages,
        hasNextPages,
    }
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
            { _id: id },
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
            isNew: false,
        }
    } catch (error) {
        console.error("Error in patchContact:", error);
        throw error;
    }
}

export const deleteContact = async (contactId) => {
    try {

        const contact = await contactColection.findByIdAndDelete(contactId);
        return contact;
    } catch (error) {
        console.error("Error in deleteContact:", error);
        throw error;
    }
}
