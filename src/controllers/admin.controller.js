const db = require("../services/db");

const renderDashboard = async (req, res) => {
  const companies = await db.company.findMany({
    where: {
      verified: false,
    },
  });
  return res.render("adminDashboard", { companies });
};

module.exports = {
  renderDashboard,
};
