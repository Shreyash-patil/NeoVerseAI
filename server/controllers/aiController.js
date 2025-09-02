import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import streamifier from "streamifier";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan != "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade your plan to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_completion_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES
    (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan != "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });

    console.log(response.choices[0].message);
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan != "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade your plan to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES
    (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan != "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });

    console.log(response.choices[0].message);
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    // const free_usage = req.free_usage;
    // commented out above line bcoz this functionality comes with premium plan

    if (plan != "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium plan subscription.",
      });
    }

    // const response = await AI.chat.completions.create({
    //   model: "gemini-2.0-flash",
    //   messages: [
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],

    //   temperature: 0.7,
    //   max_completion_tokens:length,
    // });

    // const content = response.choices[0].message.content;

    //We will use ClipDrop API instead gemini

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations(user_id, prompt, content, type, publish) VALUES
    (${userId}, ${prompt}, ${secure_url}, 'image',${publish ?? false})`;

    // if (plan != "premium") {
    //   await clerkClient.users.updateUserMetadata(userId, {
    //     privateMetadata: { free_usage: free_usage + 1 },
    //   });
    // }

    res.json({ success: true, content: secure_url });

    // console.log(response.choices[0].message);
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// export const removeImageBackground = async (req, res) => {
//   try {
//     const { userId } = await req.auth();
//     // const { image } = req.file;
//     const image  = req.file;
//     const plan = req.plan;

//     if (plan != "premium") {
//       return res.json({
//         success: false,
//         message:
//           "This feature is only available for premium plan subscription.",
//       });
//     }

//     const { secure_url } = await cloudinary.uploader.upload(image.path, {
//       transformation: [
//         {
//           effect: "background_removal",
//           background_removal: "remove_the_background",
//         },
//       ],
//     });

//     await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES
//     (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

//     res.json({ success: true, content: secure_url });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const plan = req.plan;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload an image.",
      });
    }

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium plan subscription.",
      });
    }

    // Upload from buffer instead of path
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          transformation: [
            {
              effect: "background_removal",
              background_removal: "remove_the_background",
              width: 5000,
              height: 5000,
              crop: "limit",
            },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer); // push buffer to Cloudinary
    });

    await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES
      (${userId}, 'Remove background from image', ${result.secure_url}, 'image')`;

    res.json({ success: true, content: result.secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// export const removeImageObject = async (req, res) => {
//   try {
//     const { userId } = await req.auth();
//     const { object } = req.body;
//     // const { image } = req.file;
//     const image = req.file;
//     const plan = req.plan;

//     if (plan != "premium") {
//       return res.json({
//         success: false,
//         message:
//           "This feature is only available for premium plan subscription.",
//       });
//     }

//     const { public_id } = await cloudinary.uploader.upload(image.path);

//     const imageUrl = cloudinary.url(public_id, {
//       transformation: [{ effect: `gen_remove:${object}` }],
//       resource_type: "image",
//     });

//     await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES
//     (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image',)`;

//     res.json({ success: true, content: imageUrl });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// export const removeImageObject = async (req, res) => {
//   try {
//     const { userId } = await req.auth();
//     const { object } = req.body;
//     const image = req.file;
//     const plan = req.plan;

//     if (!image) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     if (plan != "premium") {
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium plan subscription.",
//       });
//     }

//     // Stream upload from buffer
//     const uploadResult = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "uploads" },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );
//       streamifier.createReadStream(image.buffer).pipe(stream);
//     });

//     const imageUrl = cloudinary.url(uploadResult.public_id, {
//       transformation: [{ effect: `gen_remove:${object}` }],
//       resource_type: "image",
//     });

//     await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES
//       (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

//     res.json({ success: true, content: imageUrl });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// export const removeImageObject = async (req, res) => {
//   try {
//     const { userId } = await req.auth();
//     const { object } = req.body;
//     const plan = req.plan;

//     const image = req.file; // ✅ properly assign req.file
//     console.log("req.file:", req.file);

//     if (!image) {
//       return res.json({ success: false, message: "No file uploaded. Please upload an image." });
//     }

//     if (plan !== "premium") {
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium plan subscription.",
//       });
//     }

//     // Upload file to Cloudinary
//     const result = await cloudinary.uploader.upload(image.path, {
//       resource_type: "image",
//       transformation: [{ effect: `gen_remove:${object}` }],
//     });

//     const imageUrl = result.secure_url;

//     await sql`
//       INSERT INTO creations (user_id, prompt, content, type)
//       VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
//     `;

//     res.json({ success: true, content: imageUrl });
//   } catch (error) {
//     console.error("Remove object error:", error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { object } = req.body;
    const plan = req.plan;

    if (!req.file) {
      return res.json({
        success: false,
        message: "No file uploaded. Please upload an image.",
      });
    }

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium plan subscription.",
      });
    }

    // Upload buffer to Cloudinary using upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          transformation: [
            {
              effect: `gen_remove:${object}`,
              width: 5000,
              height: 5000,
              crop: "limit",
            },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const imageUrl = result.secure_url;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error("Remove object error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// export const resumeReview = async (req, res) => {
//   try {
//     const { userId } = await req.auth();
//     const resume = req.file;
//     const plan = req.plan;

//     if (plan != "premium") {
//       return res.json({
//         success: false,
//         message:
//           "This feature is only available for premium plan subscription.",
//       });
//     }

//     if (resume.size > 5 * 1024 * 1024) {
//       return res.json({
//         success: false,
//         message: "Resume file size exceeds allowed size (5MB)",
//       });
//     }

//     const dataBuffer = fs.readFileSync(resume.path);
//     const pdfData = await pdf(dataBuffer);
//     const prompt = `Review the following resume and provide constructive feedback on its strength, weaknesses, and areas of improvement. \n\n ${pdfData.text}`;

//     const response = await AI.chat.completions.create({
//       model: "gemini-2.0-flash",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],

//       temperature: 0.7,
//       max_completion_tokens: 1000,
//     });

//     const content = response.choices[0].message.content;

//     await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES
//     (${userId}, 'Review the uploaded resume', ${content}, 'resume-review',)`;

//     res.json({ success: true, content: content });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };




export const resumeReview = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (!resume) {
      return res.json({ success: false, message: "No resume uploaded" });
    }

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium plan subscription.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB)",
      });
    }

    // Use buffer, not path
    const pdfData = await pdf(resume.buffer);

    const prompt = `Review the following resume and provide constructive feedback on its strength, weaknesses, and areas of improvement:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_completion_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations(user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
