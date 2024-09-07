import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import { Preference } from "../models/preference";
const Joi = require("joi");
import { Op, literal, Sequelize } from "sequelize";
import jwt, { JwtPayload } from "jsonwebtoken";
import sequelize from "sequelize/types/sequelize";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Define JWT authentication scheme
const jwtAuthScheme = () => {
  return {
    authenticate: async (request: Request, h: ResponseToolkit) => {
      const authorization = request.headers.authorization;

      if (!authorization) {
        return h.unauthenticated(new Error("No authorization header provided"));
      }

      const token = authorization.split(" ")[1];

      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const credentials =
          typeof decoded === "string"
            ? { token: decoded }
            : (decoded as JwtPayload);
        return h.authenticated({ credentials });
      } catch (err) {
        return h.unauthenticated(err as Error);
      }
    },
  };
};

export const registerPlayRoutes = async (server: Server) => {
  // Register the JWT authentication scheme and strategy
  server.auth.scheme("jwt", jwtAuthScheme);
  server.auth.strategy("jwt", "jwt");
  server.auth.default("jwt");

  // Global error handling for authentication errors
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    if (response instanceof Error) {
      if (response.message.includes("expired")) {
        return h.response({ message: "Token has expired" }).code(401);
      }
      if (response.message === "Invalid token") {
        return h.response({ message: "Invalid token" }).code(401);
      }
    }
    return h.continue;
  });

  // Add Preference
  server.route({
    method: "POST",
    path: "/preferences",
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          hobbies: Joi.array().items(Joi.string()).required(),
          skills: Joi.array().items(Joi.string()).required(),
          teach: Joi.string().required(),
          dob: Joi.date().required(),
          learn: Joi.string().required(),
        }),
      },
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      const { name, hobbies, skills, teach, dob, learn } =
        request.payload as any;
      const userEmail = (request.auth.credentials as any).email;

      try {
        // Check if a preference already exists for the user
        const existingPreference = await Preference.findOne({
          where: { userEmail },
        });

        if (existingPreference) {
          // If preference exists, update it
          const updatedPreference = await existingPreference.update({
            name,
            hobbies,
            skills,
            teach,
            dob,
            learn,
          });

          return h
            .response({
              message: "Preference updated successfully",
              preference: updatedPreference,
            })
            .code(200);
        } else {
          // If no preference exists, create a new one
          const newPreference = await Preference.create({
            userEmail,
            name,
            hobbies,
            skills,
            teach,
            dob,
            learn,
          });

          return h
            .response({
              message: "Preference added successfully",
              preference: newPreference,
            })
            .code(201);
        }
      } catch (err) {
        console.error("Error adding/updating preference:", err);
        return h
          .response({ message: "Failed to add or update preference" })
          .code(500);
      }
    },
  });

  // Get Preference
  server.route({
    method: "GET",
    path: "/preferences",
    options: {
      auth: "jwt",
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      const userEmail = (request.auth.credentials as any).email;

      try {
        const preferences = await Preference.findOne({ where: { userEmail } });

        if (!preferences) {
          return h.response({ message: "No preferences found" }).code(404);
        }

        return h.response(preferences).code(200);
      } catch (err) {
        console.error("Error retrieving preferences:", err);
        return h
          .response({ message: "Failed to retrieve preferences" })
          .code(500);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/similar-profiles",
    options: {
      auth: "jwt",
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      // Extract `userId` from the JWT token
      const userEmail = (request.auth.credentials as JwtPayload).email;

      if (!userEmail) {
        return h.response({ message: "User ID not found in token" }).code(400);
      }

      try {
        const userPref = await Preference.findOne({ where: { userEmail } });

        if (!userPref) {
          return h
            .response({ message: "User preferences not found" })
            .code(404);
        }

        console.log("User Preferences:", userPref.toJSON());

        // Fetch similar profiles
        const similarProfiles = await Preference.findAll({
          where: {
            userEmail: { [Op.ne]: userEmail },
            [Op.or]: [
              literal(`JSON_OVERLAPS(hobbies, :userHobbies)`),
              literal(`JSON_OVERLAPS(skills, :userSkills)`),
            ],
          },
          replacements: {
            userHobbies: JSON.stringify(userPref.hobbies),
            userSkills: JSON.stringify(userPref.skills),
          },
          order: [
            [
              literal(`(
                JSON_LENGTH(JSON_EXTRACT(hobbies, "$[*]")) +
                JSON_LENGTH(JSON_EXTRACT(skills, "$[*]"))
              )`),
              "DESC",
            ],
          ],
        });

        console.log(
          "Similar Profiles:",
          similarProfiles.map((profile) => profile.toJSON())
        );

        const profiles = similarProfiles.map((pref) => ({
          name: pref.name,
          age: new Date().getFullYear() - new Date(pref.dob).getFullYear(),
          similarPreferences: {
            hobbies: pref.hobbies.filter((hobby: string) =>
              userPref.hobbies.includes(hobby)
            ),
            skills: pref.skills.filter((skill: string) =>
              userPref.skills.includes(skill)
            ),
          },
        }));

        return h.response({ similarProfiles: profiles }).code(200);
      } catch (err) {
        console.error("Error Retrieving Similar Profiles:", err);
        return h
          .response({ message: "Failed to retrieve similar profiles" })
          .code(500);
      }
    },
  });
};
