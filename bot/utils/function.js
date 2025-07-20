import FilledUser from "../model/filleduser.schema.js";
import Form from "../model/form.schema.js";

export const getUser = async (req, res) => {
  const users = await FilledUser.find({ status: "pending" });
  return users;
};

export const updateUserStatus = async (id, status) => {
  const res = await FilledUser.findByIdAndUpdate(
    id,
    { status: status },
    { new: true }
  );
  return res;
};

export const updatePercentage = async (id, percentage) => {
  const res = await FilledUser.findByIdAndUpdate(
    id,
    { similarityPercentage: percentage },
    { new: true }
  );
  return res;
};

export const updateRemarks = async (id,remarks) =>{
    const res = await FilledUser.findByIdAndUpdate(
        id,
        { remarks: remarks },
        { new: true }
    );
    return res;
}

export const getFormDetails = async (id) =>{
    const form = await Form.findById(id);
    return form;
}


export const getLtsUser = async (id) => {
  const users = await FilledUser.findById(id);
  return users;
}
