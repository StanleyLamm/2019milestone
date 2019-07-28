/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    login: async function (req, res) {
        var html = {
            title: 'Login - Event Management System', //网页标题
            page: 'Login',
        };

        if (req.method == "GET") return res.view('User/login', {html: html}); //GET 方式请求，返回登陆页面

        if (!req.body.username) return res.badRequest(); //未提供username，返回错误
        if (!req.body.password) return res.badRequest(); //未提供username，返回错误

        var user = await User.findOne({ username: req.body.username }); //根据用户名查找

        if (!user) {
            res.status(401);
            return res.send("User not found!"); //没有此用户
        }

        if (req.body.password != user.password) {
            res.status(401);
            return res.send("Wrong password!"); //密码不正确
        }

        req.session.regenerate(function (err) {  //保存登陆信息
            if (err) return res.serverError(err);
            req.session.username = user.username;
            req.session.userId = user.id;
            req.session.userRole = user.role;
            return res.ok("Success!");
        });
    },

    logout: async function (req, res) {
        req.session.destroy(function (err) { //退出登陆，删除保存的登陆信息
            if (err) return res.serverError(err);
            return res.ok("Success!");
        });
    }

};

