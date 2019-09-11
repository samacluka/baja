var path = require("path");

const viewsDir = path.join(__dirname, "../views/");

const views = {
    public: {
      home: viewsDir + "public/home",
      sponsors: viewsDir + "public/sponsors",
      recruitment: viewsDir + "public/recruitment",
      gallery: viewsDir + "public/gallery",
      photos: viewsDir + "public/photos",
    },
    auth:{
      index: viewsDir + "auth/index",
    },
    expenseReports: {
      index: viewsDir + "expenseReports/index",
      edit: viewsDir + "expenseReports/edit",
      new: viewsDir + "expenseReports/new",
      show: viewsDir + "expenseReports/show"
    },
    members: {
      index: viewsDir + "members/index",
      edit: viewsDir + "members/edit",
      show: viewsDir + "members/show"
    },
    partials: {
      footer4: viewsDir + "partials/footer4",
      header4: viewsDir + "partials/header4",
    }
};

module.exports = views;
