import moment from "moment";
import mongoose from "mongoose";

const filledUserSchema = new mongoose.Schema({
  formId: {
    type: String,
  },
  status: {
    type: String,
  },
  similarityPercentage: {
    type: Number,
    default: 0,
  },
  details: {
    personalDetail: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String,
      },
      identificationNumber: {
        type: String,
      },
      dob: {
        type: Date,
      },
      gender: {
        type: String,
      },
      phoneNumber: {
        type: Number,
      },
    },
    addressDetail: {
      addressline1: {
        type: String,
      },
      addressline2: {
        type: String,
      },
      country: {
        type: String,
      },
      zip: {
        type: Number,
      },
    },
    images: {
      face: {
        type: String,
      },
      passport: {
        type: String,
      },
    },
  },
  remarks:{
    type: String,
  },
  createdAt: {
    type: String,
    default: moment().format("MMM Do YY"),
  },
});
const FilledUser = mongoose.model("FilledUser", filledUserSchema);
export default FilledUser;
