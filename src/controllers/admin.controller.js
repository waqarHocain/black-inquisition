const db = require("../services/db");

const renderDashboard = async (req, res) => {
  const companies = await db.company.findMany({
    where: {
      verified: false,
    },
  });

  const counts = await db.$transaction([
    db.user.count(),
    db.company.count(),
    db.job.count(),
  ]);

  return res.render("adminDashboard", {
    companies,
    userCount: counts[0],
    companyCount: counts[1],
    jobCount: counts[2],
  });
};

const renderCompanyProfile = async (req, res) => {
  const { companyId } = req.params;

  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      sources: {
        select: {
          name: true,
        },
      },
    },
  });
  if (!company) return res.sendStatus(404);

  return res.render("verifyAccount", { company });
};

const approveCompany = async (req, res) => {
  const { companyId } = req.params;
  await db.company.update({
    where: { id: companyId },
    data: {
      verified: true,
    },
  });
  return res.redirect("/admin/dashboard");
};

const deleteCompany = async (req, res) => {
  const { companyId } = req.params;
  await db.company.delete({
    where: {
      id: companyId,
    },
  });
  return res.redirect("/admin/dashboard");
};

module.exports = {
  renderDashboard,
  renderCompanyProfile,
  approveCompany,
  deleteCompany,
};
