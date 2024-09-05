import { Server } from '@hapi/hapi';
import { Preference } from '../models/preference';
const Joi = require('joi');
import { Op } from 'sequelize';

export const registerPlayRoutes = (server: Server) => {
  
  // Add Preference
  server.route({
    method: 'POST',
    path: '/preferences',
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          hobbies: Joi.array().items(Joi.string().valid(
            'Sports', 'Fitness', 'Gardening', 'Singing', 'Dancing', 
            'Writing', 'Painting', 'Treks', 'Marathons', 'Binge Watching')).required(),
          skills: Joi.array().items(Joi.string().valid(
            'Yoga', 'Programming Language', 'Language', 'Woodwork', 
            'IOT', 'Doodling', 'Social Media')).required(),
          teach: Joi.string().required(),
          dob: Joi.date().required(),
          learn: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      const { name, hobbies, skills, teach, dob, learn } = request.payload as any;
      const userId = (request.auth.credentials as any).id; // Assuming `userId` comes from the JWT token

      try {
        const newPreference = await Preference.create({
          userId,
          name,
          hobbies,
          skills,
          teach,
          dob,
          learn,
        });
        
        return h.response({ message: 'Preference added successfully', preference: newPreference }).code(201);
      } catch (err) {
        return h.response({ message: 'Failed to add preference', error: err }).code(500);
      }
    },
  });

  // Get Preference
  server.route({
    method: 'GET',
    path: '/preferences',
    options: {
      auth: 'jwt',
    },
    handler: async (request, h) => {
      const userId = (request.auth.credentials as any).id; // Assuming `userId` comes from the JWT token
      
      try {
        const preferences = await Preference.findOne({ where: { userId } });
        
        if (!preferences) {
          return h.response({ message: 'No preferences found' }).code(404);
        }
        
        return h.response(preferences).code(200);
      } catch (err) {
        return h.response({ message: 'Failed to retrieve preferences', error: err }).code(500);
      }
    },
  });

  // Get Similar Profiles Without User Model
  server.route({
    method: 'GET',
    path: '/similar-profiles',
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          userId: Joi.number().required(), // Pass `userId` through the query
        }),
      },
    },
    handler: async (request, h) => {
      const { userId } = request.query as { userId: number };

      try {
        const userPref = await Preference.findOne({ where: { userId } });
        if (!userPref) {
          return h.response({ message: 'User preferences not found' }).code(404);
        }

        const similarProfiles = await Preference.findAll({
          where: {
            id: { [Op.ne]: userPref.id }, // Exclude the current user's profile
            [Op.or]: [
              { hobbies: { [Op.overlap]: userPref.hobbies } }, // Matching hobbies
              { skills: { [Op.overlap]: userPref.skills } },   // Matching skills
            ],
          },
        });

        const profiles = similarProfiles.map((pref) => ({
          name: pref.name,
          age: new Date().getFullYear() - new Date(pref.dob).getFullYear(),
          similarPreferences: {
            hobbies: pref.hobbies.filter(hobby => userPref.hobbies.includes(hobby)),
            skills: pref.skills.filter(skill => userPref.skills.includes(skill)),
          }
        }));

        return h.response({ similarProfiles: profiles }).code(200);
      } catch (err) {
        return h.response({ message: 'Failed to retrieve similar profiles', error: err }).code(500);
      }
    },
  });
};
