import { contactList } from "../constants/index.js"

const parseBoolean = item => {
    if (typeof item !== "string") return;

    if (!["true", "false"].includes(item)) return;

    return item === "true"

}

export const parseFilterParams = ({ contactType, isFavourite }) => {
    const parseType = contactList.includes(contactType) ? contactType : null;
    const parseIsFavourite = parseBoolean(isFavourite)

    return {
        contactType: parseType,
        isFavourite: parseIsFavourite,
    }
}
