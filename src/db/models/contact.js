import mongoose from "mongoose";

const contactShema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    isFavourite: {
        type: Boolean,
        required: false,
        default: false,
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        required: true,
        default: 'personal',
    },
},
    {
        timestamps: true,
        versionKey: false,
    },
);


const contactColection = mongoose.model('Contacts', contactShema);
export { contactColection };
