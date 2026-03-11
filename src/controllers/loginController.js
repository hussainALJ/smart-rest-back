import { catchAsync } from "../lib/catchAsync.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const loginController = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  

  const user = await prisma.users.findUnique({
    where: { username }
  })

  if ( !user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid username or password");
    error.statusCode = 401;
    throw error
  }

  const token = jwt.sign(
    {userId: user.id, role: user.role},
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
  )

  res.status(200).json({
    status: "success",
    token,
    data: { user: { id: user.id, username: user.username } }
  })
})