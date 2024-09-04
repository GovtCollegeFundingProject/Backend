const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const editProfile = async (req, res) => {
  if (req.role === "INDIVIDUAL") {
    const {
      taxExemptionRequired,
      anonymous,
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

const getUserData = async (req, res) => {
  const email = req.userEmail;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  delete user.password;
  if (req.role === "INDIVIDUAL") {
    const individual = await prisma.individual.findUnique({ where: { email } });
    return res.json({ user, individual });
  } else if (req.role === "COMPANY") {
    const company = await prisma.company.findUnique({ where: { email } });
    return res.json({ user, company });
  }
};

module.exports = {
  editProfile,
  getUserData,
};
