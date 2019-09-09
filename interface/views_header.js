module.exports = function(url){
    if(url ==  "/")                                                      return "home";
    if(url ==  "/sponsors")                                              return "Sponsors";
    if(url ==  "/recruitment")                                           return "Recruitment";
    if(url ==  "/gallery")                                               return "Gallery";

    if(url ==  "/expenseReports")                                        return "Expense Reports";
    if(url ==  "/expenseReports/new")                                    return "New Expense Report";
    if( /^\/expenseReports\/([a-zA-Z0-9]{24})$/.test(url))               return "Expense Report";
    if( /^\/expenseReports\/([a-zA-Z0-9]{24})\/edit$/.test(url))         return "Edit Expense Report";

    if(url ==  "/auth")                                                  return "Authentication";
}
