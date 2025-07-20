import mongoose from "mongoose";
import moment from "moment";
const formSchema = new mongoose.Schema({
  formName: {
    type: String,
  },
  orgName: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  users: {
    type: Array,
  },
  status: {
    type: Boolean,
    default: true,
  },
  link: {
    type: String,
  },
  createdAt: {
    type: String,
    default: moment().format("MMM Do YY"),
  },
});
const Form = mongoose.model("Form", formSchema);
export default Form;
