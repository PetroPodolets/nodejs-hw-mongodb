import mongoose from "mongoose";
import { contactFieldList, sortOrderList } from "../constants/index.js";
import { contactColection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({ page, perPage, sortBy = contactFieldList[0], sortOrder = sortOrderList[0], filter, userId }) => {
    const skip = (page - 1) * perPage;

    const databaseQuery = contactColection.find({ userId });
    if (filter.contactType) {
        databaseQuery.where("contactType").equals(filter.contactType);
    }

    if (filter.isFavourite != null) {
        databaseQuery.where("isFavourite").equals(filter.isFavourite);
    }

    const [totalItems, data] = await Promise.all([
        contactColection.countDocuments({ ...filter, userId }),
        databaseQuery
            .skip(skip)
            .limit(perPage)
            .sort({ [sortBy]: sortOrder })
            .exec(),
    ]);

    const { totalPages, hasNextPages, hasPreviousPages } = calculatePaginationData({ total: totalItems, page, perPage });

    return {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPages,
        hasNextPages,
    };
};




export const getContactById = async (contactId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw new Error('Invalid contact ID');
    }

    try {
        console.log(`Searching for contact with ID: ${contactId} and user ID: ${userId}`);

        const contact = await contactColection.findOne({ _id: contactId, userId });
        console.log(`Contact found: ${contact}`);

        return contact;
    } catch (error) {
        console.error(`Error fetching contact: ${error.message}`);
        throw new Error(`Error fetching contact: ${error.message}`);
    }
};

export const addContact = async (contact) => {
    const { userId, ...contactData } = contact;
    return contactColection.create({ ...contactData, userId });
};


export const patchContact = async (contactId, userId, data, options = {}) => {
    try {
        console.log("Updating contact with ID:", contactId, "and data:", data);
        const result = await contactColection.findOneAndUpdate(
            { _id: contactId, userId },
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
        };
    } catch (error) {
        console.error("Error in patchContact:", error);
        throw error;
    }
};


export const deleteContact = async (contactId, userId) => {
    try {
        const contact = await contactColection.findOneAndDelete({ _id: contactId, userId });
        return contact;
    } catch (error) {
        console.error("Error in deleteContact:", error);
        throw error;
    }
};
