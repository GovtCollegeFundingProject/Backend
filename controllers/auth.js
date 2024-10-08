const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { errorHandler } = require("../middlewares/error.js");

const findMissingFields = (requiredFields, fields) => {
  const missingFields = requiredFields.filter(
    (field) => fields[field] === undefined
  );
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
      individualUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const registerCompany = async (req, res, next) => {
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
      .send({ message: "User registered successfully", companyUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ error: "Please provide both email and password" });
//     }
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return next(errorHandler(404, "User Not Found !!"));
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return next(errorHandler(401, "Invalid Password !!"));
//     }
//     const token = jwt.sign(
//       { userId: user.email, role: user.role },
//       process.env.JWT_SECRET
//     );
//     if (user.role === "INDIVIDUAL") {
//       const individualData = await prisma.individual.findUnique({
//         where: { email },
//       });

//       res.status(200).json({
//         message: "Login successful",
//         token,
//         userName: user.name,
//         individualData,
//       });
//     } else if (user.role === "COMPANY") {
//       const companyData = await prisma.company.findUnique({
//         where: { email },
//       });
//       res.status(200).json({
//         message: "Login successful",
//         token,
//         userName: user.name,
//         companyData,
//       });
//     }

//     // Send response with the token or user info
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user,
//     });

//     console.log("User logged in");
//   } catch (error) {
//     console.error("Login error:", error);
//     next(error);
//   }
// };

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

    // Prepare response based on role
    let userData = {};
    if (user.role === "INDIVIDUAL") {
      const individualData = await prisma.individual.findUnique({
        where: { email },
      });
      userData = {
        message: "Login successful",
        token,
        userName: user.name,
        individualData,
      };
    } else if (user.role === "COMPANY") {
      const companyData = await prisma.company.findUnique({
        where: { email },
      });
      userData = {
        message: "Login successful",
        token,
        userName: user.name,
        companyData,
      };
    } else {
      userData = {
        message: "Login successful",
        token,
        user,
      };
    }

    // Send the final response
    res.status(200).json(userData);

    console.log("User logged in");
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// Controller function to get total amount of transactions
const getTotalTransactionAmount = async (req, res, next) => {
  try {
    const totalAmount = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
    });

    res.status(200).json({
      totalAmount: totalAmount._sum.amount || 0, // Return 0 if no transactions
    });
  } catch (error) {
    console.error("Error fetching total transaction amount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerIndividual,
  registerCompany,
  login,
  getTotalTransactionAmount,
};
