module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },
  //   Function that doesn not take you to the login page or the welcome page
  ensureGuest: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  }
};
