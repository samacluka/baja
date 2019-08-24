var path = require("path");

const viewsDir = path.join(__dirname, "../views/");

const views = {
    home: viewsDir + "home",
    sponsors: viewsDir + "sponsors",
    recruitment: viewsDir + "recruitment",
    gallery: viewsDir + "gallery",
    members: {
      login: viewsDir + "members/login",
      register: viewsDir + "members/register",
      expenseReports: {
        index: viewsDir + "members/expense_reports/index",
        edit: viewsDir + "members/expense_reports/edit",
        new: viewsDir + "members/expense_reports/new",
        show: viewsDir + "members/expense_reports/show"
      },
      Users: {
        index: viewsDir + "members/users/index",
        edit: viewsDir + "members/users/edit",
        new: viewsDir + "members/users/new",
        show: viewsDir + "members/users/show"
      },
      partials: {
        category: viewsDir + "partials/category",
        footer: viewsDir + "partials/footer",
        footer4: viewsDir + "partials/footer4",
        header: viewsDir + "partials/header",
        header4: viewsDir + "partials/header4",
        subteam: viewsDir + "partials/subteam"
      }
    }
};

module.exports = views;
