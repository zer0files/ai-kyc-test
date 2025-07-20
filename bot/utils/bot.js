import { compare } from "./face.js";
import { extractText } from "./docs.js";
import {
  getUser,
  updateUserStatus,
  updatePercentage,
  updateRemarks,
  getFormDetails,
  getLtsUser,
} from "./function.js";
import message from "./msg.js";
import sendEmail from "./sendEmail.js";

const url = process.env.SERVER_URL;

const bot = async () => {
  console.log("Bot is running...");
  console.log(url);
  try {
    const users = await getUser();
    if (users.length === 0) {
      console.log("No filled user found");
      return;
    }
    users.map(async (user) => {
      const compareResult = await compare(
        `${url}/${user.details.images.face}`,
        `${url}/${user.details.images.passport}`
      );
      const docsResult = await extractText(
        `${url}/${user.details.images.passport}`,
        "image/all"
      );

      console.log(compareResult);
      console.log(docsResult);

      const checkDetails = {
        name:
          user.details.personalDetail.firstName.toLowerCase() +
            " " +
            user.details.personalDetail.lastName.toLowerCase() ===
          docsResult?.name?.toLowerCase(),

        country:
          user.details.addressDetail.country.toLowerCase() ===
          docsResult?.country?.toLowerCase(),
        passportNumber:
          user.details.personalDetail.identificationNumber.toLowerCase() ===
          docsResult?.passportno?.toLowerCase(),
      };

      if (
        compareResult.match &&
        checkDetails.name &&
        checkDetails.country &&
        checkDetails.passportNumber
      ) {
        const updateStatus = await updateUserStatus(user._id, "verified");
        const updatePerc = await updatePercentage(
          user._id,
          compareResult.similarityPercentage
        );
        await updateRemarks(user._id, "No need to worry");
        console.log(`User ${user._id} verified`);
      }
      if (
        !compareResult.match ||
        !checkDetails.name ||
        !checkDetails.country ||
        !checkDetails.passportNumber
      ) {
        const updateStatus = await updateUserStatus(user._id, "rejected");
        const updatePerc = await updatePercentage(
          user._id,
          compareResult.similarityPercentage
        );
        let face = false;
        let docs = false;
        if (!compareResult.match) {
          face = true;
        }
        if (
          !checkDetails.name ||
          !checkDetails.country ||
          !checkDetails.passportNumber
        ) {
          docs = true;
        }
        if(face && docs){
          await updateRemarks(user._id, "Face and Document Verification Failed");
        }
        if(face && !docs){
          await updateRemarks(user._id, "Face Verification Failed");
        }
        if(!face && docs){
          await updateRemarks(user._id, "Document Verification Failed");
        }
        console.log(`User ${user._id} Rejected`);
      }
      //send email logic
      const usr = await getLtsUser(user._id);
      const form = await getFormDetails(usr.formId);
      const html = message(usr, form.formName);

      const res = await sendEmail(
        usr.details.personalDetail.email,
        "KYC Verification",
        html
      );
      console.log(res.message);
      return;
    });
  } catch (error) {
    console.log(error);
  }
};

export default bot;
