const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { errorHandler } = require("../middlewares/error.js");

const findMissingFields = (requiredFields, fields) => {
  const missingFields = requiredFields.filter((field) => !fields[field]);

  return missingFields;
};
const registerIndividual = async (req, res, next) => {
  const {
    email,
    password,
    role,
    phoneNumber,
    whatsappCompatible,
    taxExemptionRequired,
    anonymous,
    aadhar,
    pan,
    salutation,
    name,
    residency,
  } = req.body;

  try {
    // Save user details in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      return next(errorHandler(401, "User already exists !"));
    }
    const missingFields = findMissingFields(
      [
        "email",
        "password",
        "role",
        "phoneNumber",
        "whatsappCompatible",
        "taxExemptionRequired",
        "anonymous",
        "salutation",
        "name",
      ],
      req.body
    );
    if (missingFields.length > 0) {
      return next(
        errorHandler(
          400,
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        phoneNumber,
        whatsappCompatible: Boolean(whatsappCompatible), // Ensure it's a boolean
        taxExemptionRequired: Boolean(taxExemptionRequired), // Ensure it's a boolean
        anonymous: Boolean(anonymous),
        createdOn: new Date(),
      },
    });

    const individualUser = await prisma.individual.create({
      data: {
        email: newUser.email, // Link to the User record via email
        aadhar,
        pan,
        salutation,
        name,
        residency,
      },
    });

    res.status(201).send({
      message: "User registered successfully",
      user: newUser,
      individualUser,
    });
    console.log("User created", newUser, individualUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const registerCompany = async (req, res) => {
  const {
    email,
    password,
    role,
    phoneNumber,
    whatsappCompatible,
    taxExemptionRequired,
    anonymous,
    companyID,
    pan,
    salutation,
    name,
    contactPersonName,
  } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      return next(errorHandler(401, "User already exists !"));
    }
    const missingFields = findMissingFields(
      [
        "email",
        "password",
        "role",
        "phoneNumber",
        "whatsappCompatible",
        "taxExemptionRequired",
        "anonymous",
        "salutation",
        "name",
        "companyID",
        "pan",
        "contactPersonName",
      ],
      req.body
    );
    if (missingFields.length > 0) {
      return next(
        errorHandler(
          400,
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    }
    // Save user details in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        phoneNumber,
        whatsappCompatible: Boolean(whatsappCompatible), // Ensure it's a boolean
        taxExemptionRequired: Boolean(taxExemptionRequired), // Ensure it's a boolean
        anonymous: Boolean(anonymous),
        createdOn: new Date(),
      },
    });

    const companyUser = await prisma.company.create({
      data: {
        email: newUser.email, // Link to the User record via email
        companyID,
        name, // Assuming company name is the same as the person's name in `Individual`
        pan,
        salutation,
        contactPersonName,
      },
    });

    res
      .status(201)
      .send({ message: "User registered successfully", user: newUser });
    console.log("User created", newUser, companyUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(errorHandler(404, "User Not Found !!"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid Password !!"));
    }
    const token = jwt.sign(
      { userId: user.email, role: user.role },
      process.env.JWT_SECRET
    );

    // Send response with the token or user info
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

    console.log("User logged in");
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

module.exports = { registerIndividual, registerCompany, login };
