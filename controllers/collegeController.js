const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function getColleges(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const colleges = await prisma.college.findMany({
      skip: skip,
      take: limit,
    });

    res.json(colleges);
  } catch (err) {
    next(err);
  }
}

module.exports = { getColleges };
