const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const registerIndividual = async (req, res) => {
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
    res.status(400).redirect("/login");
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
    res.status(400).redirect("/login");
  }
};

const login = async (req, res) => {
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
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user.email, role: user.role },
      process.env.JWT_SECRET
    );

    // Send response with the token or user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        whatsappCompatible: user.whatsappCompatible,
        anonymous: user.anonymous,
      },
    });

    console.log("User logged in");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const editProfile = async (req, res) => {
  if (req.role === "INDIVIDUAL") {
    const {
      taxExemptionRequired,
      anonymous,
      aadhar,
      pan,
      salutation,
      name,
      residency,
    } = req.body;
    const email = req.userEmail;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the User model
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        taxExemptionRequired: Boolean(taxExemptionRequired),
        anonymous: Boolean(anonymous),
      },
    });

    await prisma.individual.update({
      where: { email },
      data: {
        aadhar,
        pan,
        salutation,
        name,
        residency,
      },
    });
  }

  if (req.role === "COMPANY") {
    const {
      taxExemptionRequired,
      anonymous,
      companyID,
      pan,
      salutation,
      name,
      contactPersonName,
    } = req.body;
    const email = req.userEmail;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the User model
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        taxExemptionRequired: Boolean(taxExemptionRequired),
        anonymous: Boolean(anonymous),
      },
    });

    await prisma.company.update({
      where: { email },
      data: {
        companyID,
        pan,
        salutation,
        name,
        contactPersonName,
      },
    });
  }
};

module.exports = { registerIndividual, registerCompany, login, editProfile };
