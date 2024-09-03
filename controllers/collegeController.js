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
const getCollegesByDistrict = async (req, res) => {
  const { district } = req.params;
  console.log(district);
  try {
    const colleges = await prisma.college.findMany({
      where: {
        district: district,
      },
    });

    if (colleges.length === 0) {
      return res
        .status(404)
        .json({ message: "No colleges found in this district." });
    }

    return res.status(200).json(colleges);
  } catch (error) {
    console.error("Error fetching colleges by district:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
module.exports = { getColleges, getCollegesByDistrict };
