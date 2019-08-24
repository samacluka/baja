const views = {
    home: "/",
    sponsors: "/sponsors",
    recruitment: "/recruitment",
    gallery: "/gallery",
    members: {
      login: "/members/login",
      register: "/members/register",
      expenseReports: {
        index: "members/expense_reports/index",
        edit: "members/expense_reports/edit",
        new: "members/expense_reports/new",
        show: "members/expense_reports/show"
      },
      Users: {
        index: viewsDir + "members/users/index",
        edit: viewsDir + "members/users/edit",
        new: viewsDir + "members/users/new",
        show: viewsDir + "members/users/show"
      }
    }
};

module.exports = views;
