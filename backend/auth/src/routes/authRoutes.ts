import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user"; // Assuming you have a User model defined
const Joi = require("joi"); // Correct import for Joi

// Secret key for JWT token (should be stored in environment variables)
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const registerRoutes = (server: Server) => {
  // Register Route
  server.route({
    method: "POST",
    path: "/register",
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
        }),
      },
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      console.log(request.payload);
      const { email, password } = request.payload as {
        email: string;
        password: string;
      };

      try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return h.response({ message: "User already exists" }).code(400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ email, password: hashedPassword });
        return h
          .response({ message: "User registered successfully", user: newUser })
          .code(201);
      } catch (err) {
        return h
          .response({ message: "Registration failed", error: err })
          .code(500);
      }
    },
  });

  // Login Route
  server.route({
    method: "POST",
    path: "/login",
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
        }),
      },
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      const { email, password } = request.payload as {
        email: string;
        password: string;
      };

      try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return h.response({ message: "Invalid email or password" }).code(401);
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return h.response({ message: "Invalid email or password" }).code(401);
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
          expiresIn: "2m",
        });

        return h.response({ message: "Login successful", token }).code(200);
      } catch (err) {
        return h.response({ message: "Login failed", error: err }).code(500);
      }
    },
  });

  // Logout Route
  server.route({
    method: "POST",
    path: "/logout",
    handler: async (request: Request, h: ResponseToolkit) => {
      // Invalidate token on frontend (usually done client-side)
      return h.response({ message: "Logged out successfully" }).code(200);
    },
  });

  // Token Validation Middleware
  // server.auth.scheme("jwt", () => {
  //   return {
  //     authenticate: async (request: Request, h: ResponseToolkit) => {
  //       const authorization = request.headers.authorization;

  //       if (!authorization) {
  //         throw h.unauthenticated({
  //           message: "No authorization header provided",
  //           name: "NoAuthorizationHeader",
  //         });
  //       }

  //       const token = authorization.split(" ")[1];

  //       try {
  //         const decoded = jwt.verify(token, SECRET_KEY);

  //         // Ensure the credentials are an object
  //         const credentials = typeof decoded === 'string' ? { token: decoded } : decoded as JwtPayload;

  //         return h.authenticated({ credentials });
  //       } catch (err) {
  //         throw h.unauthenticated({
  //           message: "Invalid token",
  //           name: "InvalidToken",
  //         });
  //       }
  //     },
  //   };
  // });

  // // Apply JWT authentication only to protected routes
  // server.auth.strategy("jwt", "jwt");
  // server.auth.default("jwt");
};
