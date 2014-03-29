/**
 * Created by jhon on 28/03/14.
 */
module.exports = function (app, passport) {
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter'), function (req, res) {
        res.redirect("http://bogodata.org");
    });

    app.get('/auth/facebook/callback', passport.authenticate('facebook'), function (req, res) {
        res.redirect("http://bogodata.org");
    });
};
