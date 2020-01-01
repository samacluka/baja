module.exports = function(url){
    if(url == "/")                                                      return "home";
    if(/^\/post\/([a-zA-Z0-9]{19})$/.test(url))                         return "Blog Post";
    if(url == "/sponsors")                                              return "Sponsors";
    if(url == "/recruitment")                                           return "Recruitment";
    if(url == "/gallery")                                               return "Gallery";
    if(/^\/gallery\/(.*)$/.test(url))                                   return decodeURI(url.substring(9).replace(/_/g," "));

    if(url == "/expenseReports")                                        return "Expense Reports";
    if(url == "/expenseReports/new")                                    return "New Expense Report";
    if(/^\/expenseReports\/([a-zA-Z0-9]{24})$/.test(url))               return "Expense Report";
    if(/^\/expenseReports\/([a-zA-Z0-9]{24})\/edit$/.test(url))         return "Edit Expense Report";

    if(url == "/members")                                               return "Members";
    if(/^\/members\/([a-zA-Z0-9]{24})$/.test(url))                      return "Profile";

    if(url == "/auth")                                                  return "Authentication";
}
