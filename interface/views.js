var path = require("path");

const viewsDir = path.join(__dirname, "../views/");

const views = {
    home: viewsDir + "home",
    external: {
      sponsors: viewsDir + "external/sponsors",
      recruitment: viewsDir + "external/recruitment",
      gallery: viewsDir + "external/gallery",
      albums: viewsDir + "external/albums.ejs",
    },
    auth:{
      index: viewsDir + "auth/index",
      login: viewsDir + "auth/login",
      register: viewsDir + "auth/register",
    },
    members: {
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
        footer4: viewsDir + "partials/footer4",
        header4: viewsDir + "partials/header4",
      }
    }
};

module.exports = views;
