/**
 * EventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    home: async function (req, res) {
        var events =  await Event.find({
            limit: 4, //First Page只显示4个Event
            where: {highlighted: true}, //筛选条件，highlighted的才显示
            sort: 'id DESC', //按id降序，即id越大（最新创建的）的排在前面
        });
        var html = {
            page: 'Home',
        };
        if (req.wantsJSON) {
            return res.json(events);
        }
        return res.view('Event/home', {events: events, html: html}); //给View输出页面
    },

    details: async function (req, res) {
        var message = Event.getInvalidIdMsg(req.params);
        if (message) return res.badRequest(message); //简要检查传入的id
        var model = await Event.findOne(req.params.id); //查找指定id的Event
        if (!model) return res.notFound(); //未找到对应id的Event，返回404

        if(req.session.userRole === 'student'){
            var userEvents =  await User.findOne(req.session.userId).populate('events', {where: {id: req.params.id}});
            model.isBook = userEvents.events.length > 0 ? true : false;
        }
        if (req.wantsJSON) {
            return res.json(model);
        }
        return res.view('Event/details', { event: model, html: {page: 'Details'}}); //给View输出页面
    },

    admin: async function (req, res) {
        if(req.session.userRole !== 'admin'){ //非admin角色不允许删除Event
            res.status(403);
            return res.send("Forbidden");
        }
        var events = await Event.find(); //查找所有event
        var html = {
            title: 'Admin - Event Management System', //网页标题
            page: 'Admin',
        };
        return res.view('Event/admin', {events: events, html: html}); //给View输出页面
    },

    create: async function (req, res) {
        if(req.session.userRole !== 'admin'){ //非admin角色不允许删除Event
            res.status(403);
            return res.send("Forbidden");
        }
        if (req.method == "GET"){
            var html = {
                title: 'Create - Event Management System', //网页标题
                page: 'Create',
            };
            return res.view('Event/create', {html: html});
        }
        if (typeof req.body.Event === "undefined")
            return res.badRequest("Form-data not received.");
        await Event.create(req.body.Event);
        return res.ok("Successfully created!");
    },

    update: async function (req, res) {
        if(req.session.userRole !== 'admin'){ //非admin角色不允许删除Event
            res.status(403);
            return res.send("Forbidden");
        }
        var message = Event.getInvalidIdMsg(req.params);
        if (message) return res.badRequest(message);
        if (req.method == "GET") { //GET方式请求，返回页面
            var model = await Event.findOne(req.params.id);
            if (!model) return res.notFound();
            var html = {
                title: 'Update - Event Management System', //网页标题
                page: 'Update',
            };
            return res.view('Event/update', {event: model, html: html});
        }
        if (req.method == "POST") { //POST方式请求，更新信息
            if (typeof req.body.Event === "undefined")
                return res.badRequest("Form-data not received.");
            //更新Event
            var model = await Event.update(req.params.id).set({
                eventName: req.body.Event.eventName,
                shortDesc: req.body.Event.shortDesc,
                fullDesc: req.body.Event.fullDesc,
                imgURL: req.body.Event.imgURL,
                organizer: req.body.Event.organizer,
                eventDate: req.body.Event.eventDate,
                time: req.body.Event.time,
                venue: req.body.Event.venue,
                quota: req.body.Event.quota,
                highlighted: req.body.Event.highlighted || false,
            }).fetch();
            if (model.length == 0) return res.notFound();
            return res.ok("Event updated");
        }
    },

    delete: async function (req, res) {
        if(req.session.userRole !== 'admin'){ //非admin角色不允许删除Event
            res.status(403);
            return res.send("Forbidden");
        }
        if (req.method == 'GET') return res.forbidden(); //禁止GET方式访问
        var message = Event.getInvalidIdMsg(req.params);
        if (message) return res.badRequest(message);
        var model = await Event.destroy(req.params.id).fetch(); //删除Event
        if (model.length == 0) return res.notFound();
        return res.ok("Event deleted");
    },

    search: async function (req, res) {
        //读取传入的搜索条件，默认为空
        const qEventName = req.query.eventName || '';
        const qOrganizer = req.query.organizer || '';
        const qStartDate = req.query.startDate || '';
        const qEndDate = req.query.endDate || '';
        const qVenue = req.query.venue || '';

        const qPage = Math.max(req.query.page -1, 0) || 0; //读取页码
        const itemsPerPage = 2; //每页显示2个Event

        var eventWhere = {}; //搜索条件
        var pageCond = { //保存搜索条件
            eventName: qEventName,
            organizer: qOrganizer,
            startDate: qStartDate,
            endDate: qEndDate,
            venue: qVenue,
            nowPage: qPage + 1, //当前页码
            pageTotalNum: 0,
            url: ''
        };
        if(qEventName != '') {
            eventWhere.eventName = {contains: qEventName}; //条件，Event Name包含传入的关键词
            pageCond.url += 'eventName=' + encodeURI(qEventName) + '&'; //组合分页的url
        }
        if (qOrganizer != '') {
            eventWhere.organizer = qOrganizer; //搜索条件，organizer等于传入的organizer
            pageCond.url += 'organizer=' + encodeURI(qOrganizer) + '&'; //组合分页的url
        }
        if (qVenue != '') {
            eventWhere.venue = qVenue; //搜索条件，organizer等于传入的organizer
            pageCond.url += 'venue=' + encodeURI(qVenue) + '&'; //组合分页的url
        }
        if (qStartDate != '') {
            eventWhere.eventDate = {'>=': qStartDate}; //如果有传入StartDate,就设置条件
            pageCond.url += 'startDate=' + encodeURI(qStartDate) + '&'; //组合分页的url
        }
        if (qEndDate != '') {
            if (qStartDate != '') {
                eventWhere.eventDate = {'>=': qStartDate, '<=': qEndDate}; //如果qStartDate和qEndDate都设置了，就设置两个搜索条件
            } else {
                eventWhere.eventDate = {'<=': qEndDate}; //只传入了EndDate，就只设置这个条件
            }
            pageCond.url += 'endDate=' + encodeURI(qEndDate) + '&'; //组合分页的url
        }

        //sails.log(eventWhere);

        var eventTotalNum = await Event.count({where: eventWhere}); //读取符合条件的Event总数
        pageCond.pageTotalNum = Math.ceil(eventTotalNum / itemsPerPage); //计算符合条件的Event总共有多少页，itemsPerPage是每页的个数

        if (req.wantsJSON) {
            //查询结果，不分页，把符合条件的全部返回。
            var events =  await Event.find({
                where: eventWhere,
                sort: 'id DESC', //id降序排序
            });
            return res.json(events);
        } else {
            //查询结果
            var events =  await Event.find({
                limit: itemsPerPage,
                where: eventWhere,
                sort: 'id DESC', //id降序排序
                skip: itemsPerPage * qPage //跳过Event的个数，用于分页
            });
        }

        var html = {
            title: 'Search - Event Management System', //网页标题
            page: 'Search',
        };

        return res.view('Event/search', {events: events, pageCond: pageCond, html: html});
    },

    book: async function (req, res) {
        if(req.session.userRole !== 'student'){ //非学生角色不允许预定Event或取消预定Event
            res.status(403);
            return res.send("Forbidden");
        }
        if (req.method !== 'POST') { // 非POST方法，拒绝访问
            res.status(403);
            return res.send("Forbidden");
        }
        var message = Event.getInvalidIdMsg(req.params);
        if (message) return res.badRequest(message); //简要检查传入的id
        var event = await Event.findOne(req.params.id); //查找指定id的Event
        if (!event) {
            res.status(404);
            return res.send("Event Not Found");//未找到对应id的Event，返回404
        }

        if (event.quota <= 0){ //quota不足
            res.status(403);
            return res.send("Not enough quota");
        }
        await Event.update(req.params.id).set({ //更新Event, quota减一
            quota: event.quota -1
        });
        await User.addToCollection(req.session.userId, 'events').members(event.id);

        res.status(200);
        return res.send("Success");
    },
    
    cancel: async function (req, res) {
        if(req.session.userRole !== 'student'){ //非学生角色不允许预定Event或取消预定Event
            res.status(403);
            return res.send("Forbidden");
        }
        if (req.method !== 'DELETE') { // 非 DELETE 方法，拒绝访问
            res.status(403);
            return res.send("Forbidden");
        }
        var message = Event.getInvalidIdMsg(req.params);
        if (message) return res.badRequest(message); //简要检查传入的id
        var event = await Event.findOne(req.params.id); //查找指定id的Event
        if (!event) {
            res.status(404);
            return res.send("Event Not Found");//未找到对应id的Event，返回404
        }
        await Event.update(req.params.id).set({ //更新Event, quota加一
            quota: event.quota +1
        });
        await Event.removeFromCollection(req.params.id, 'users').members(req.session.userId);

        res.status(200);
        return res.send("Success");

    },

    myEvents: async function (req, res) {
        if(req.session.userRole !== 'student'){ //非学生角色不允许查看myEvents
            res.status(403);
            return res.send("Forbidden");
        }
        var events = await User.findOne(req.session.userId).populate('events');
        if(req.wantsJSON) {
            return res.json(events.events);
        }
        var html = {
            title: 'My Events - Event Management System', //网页标题
            page: 'MyEvents',
        };
        return res.view('Event/myEvents', { events: events.events, html: html});
    },

    registration: async function (req, res) {
        if(req.session.userRole !== 'admin'){ //非admin角色不允许删除Event
            res.status(403);
            return res.send("Forbidden");
        }
        var event =  await Event.findOne(req.params.id).populate('users');
        return res.view('Event/registration', { event: event, html: {}});
    },
};

