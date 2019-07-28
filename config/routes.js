/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': { view: 'pages/homepage' },
  '/': 'EventController.home',
  'GET /Event/details/:id': 'EventController.details',
  'GET /Event/admin': 'EventController.admin',
  'GET /Event/create': 'EventController.create',
  'POST /Event/create': 'EventController.create',
  'GET /Event/update/:id': 'EventController.update',
  'POST /Event/update/:id': 'EventController.update',
  'POST /Event/delete/:id': 'EventController.delete',
  'GET /Event/search': 'EventController.search',
  'POST /Event/book/:id' : 'EventController.book',
  'DELETE /Event/book/:id' : 'EventController.cancel',
  'GET /Event/myEvents': 'EventController.myEvents',
  'GET /Event/registration/:id': 'EventController.registration',

  'GET /User/login': 'UserController.login',
  'POST /User/login': 'UserController.login',
  'GET /User/logout': 'UserController.logout',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                                *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
