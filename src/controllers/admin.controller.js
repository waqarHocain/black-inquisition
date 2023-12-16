const db = require("../services/db");
const { ROLES } = require("../config");

const renderDashboard = async (req, res) => {
  const companies = await db.user.findMany({
    where: {
      verified: false,
      role: ROLES.COMPANY,
    },
  });

  const users = await db.user.findMany({
    where: {
      verified: false,
      role: ROLES.USER,
    },
  });

  const [userCount, companyCount, jobCount] = await db.$transaction([
    db.user.count({
      where: {
        role: ROLES.USER,
      },
    }),
    db.user.count({
      where: {
        role: ROLES.COMPANY,
      },
    }),
    db.job.count(),
  ]);

  return res.render("adminDashboard", {
    companies,
    users,
    userCount,
    companyCount,
    jobCount,
  });
};

const renderCompanyProfile = async (req, res) => {
  const { companyId } = req.params;

  const company = await db.user.findUnique({
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

const renderUserProfile = async (req, res) => {
  const { userId } = req.params;

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return res.sendStatus(404);

  return res.render("verifyUserAccount", { user });
};

const approveCompany = async (req, res) => {
  const { companyId } = req.params;
  await db.user.update({
    where: { id: companyId },
    data: {
      verified: true,
    },
  });
  return res.redirect("/admin/dashboard");
};

const deleteCompany = async (req, res) => {
  const { companyId } = req.params;
  await db.user.delete({
    where: {
      id: companyId,
    },
  });
  return res.redirect("/admin/dashboard");
};

const approveUser = async (req, res) => {
  const { userId } = req.params;
  await db.user.update({
    where: { id: userId },
    data: {
      verified: true,
    },
  });
  return res.redirect("/admin/dashboard");
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  await db.user.delete({
    where: {
      id: userId,
    },
  });
  return res.redirect("/admin/dashboard");
};

module.exports = {
  renderDashboard,
  renderCompanyProfile,
  renderUserProfile,
  approveCompany,
  deleteCompany,
  approveUser,
  deleteUser,
};
