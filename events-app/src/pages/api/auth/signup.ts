// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "./[...nextauth]";
import { connectToDatabase } from "@/lib/mongodb";
import Attendee from "@/models/Attendee";
import { z } from "zod";

export const signupBodySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password is required")
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).end(); // Method Not Allowed
    }

    const { firstName, lastName, email, password } = req.body;

    //validate body
    signupBodySchema.parse(req.body);

    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await Attendee.findOne({ email })

    if (existingUser) {
      // just sign them in... confrim behaviour w team
      return res.status(200).json({ success: true, data: existingUser });

      // return res.status(409).json({ message: "User with that email already exists! Please sign in instead" });
    }

    const passwordHash = await hashPassword(password);

    const newUser = new Attendee({
      firstName,
      lastName,
      email,
      passwordHash
    });

    const signUpUserResponse = (await newUser.save()).toObject();
    delete signUpUserResponse.passwordHash; //don't return the hash

    return res.status(200).json({ success: true, data: signUpUserResponse });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues)
      return res.status(400).json({ success: false, errors: error.issues });
    }
    console.error("Error during signup:", error); 
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
