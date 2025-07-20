import * as faceapi from "@vladmandic/face-api";
import { Canvas, Image, ImageData, loadImage } from "canvas";

// Configure canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load face-api models
const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
};

// Extract face encodings
const getFaceDescriptors = async (imagePath) => {
  const img = await loadImage(imagePath);
  const detections = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks()
    .withFaceDescriptors();
  return detections.map((detection) => detection.descriptor);
};

// Compare faces and return similarity percentage
const compareFaces = (descriptor1, descriptor2) => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  const maxDistance = 0.6; // Define your threshold
  const similarity = Math.max(0, 1 - distance / maxDistance); // Normalized value between 0 and 1
  return similarity * 100; // Convert to percentage
};

// Compare two images and return a JSON response
export const compare = async (userImagePath, docImagePath) => {
  await loadModels();

  try {
    const userDescriptors = await getFaceDescriptors(userImagePath);
    const docDescriptors = await getFaceDescriptors(docImagePath);

    

    if (userDescriptors.length === 0) {
      return {
        match: false,
        similarityPercentage: null,
        remarks: "No faces detected in user image.",
      };
    }

    if (docDescriptors.length === 0) {
      return {
        match: false,
        similarityPercentage: null,
        remarks: "No faces detected in document image.",
      };
    }

    // Assuming you want to compare the first faces from each set
    const [userDescriptor] = userDescriptors;
    const [docDescriptor] = docDescriptors;

    const similarityPercentage = compareFaces(userDescriptor, docDescriptor);
    const isMatch = similarityPercentage > 30; // Define your threshold

    return {
      match: isMatch,
      similarityPercentage: similarityPercentage.toFixed(2),
      remarks: isMatch ? "Faces match." : "Faces do not match.",
    };
  } catch (error) {
    console.log("error in face",error);
    return {
      match: false,
      similarityPercentage: null,
      remarks: `Error: ${error.message}`,
    };
  }
};

