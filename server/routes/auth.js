/**
 * Created by jhon on 28/03/14.
 */
module.exports = function (app, passport) {
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect("/#!/auth/refresh");
    });

    app.get('/auth/user', function (req, res) {
        return res.status(200).json(req.user);
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter'), function (req, res) {
        res.redirect("/#!/auth/refresh");
    });

    app.get('/auth/facebook/callback', passport.authenticate('facebook'), function (req, res) {
        res.redirect("/#!/auth/refresh");
    });
}