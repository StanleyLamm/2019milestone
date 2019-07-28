/**
 * Event.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    eventName: {
      type: 'string',
    },
    shortDesc: {
      type: 'string',
    },
    fullDesc: {
      type: 'string',
    },
    imgURL: {
      type: 'string',
    },
    organizer: {
      type: 'string',
    },
    eventDate: {
      type: 'string',
      columnType: 'date'
    },
    time: {
      type: 'string',
    },
    venue: {
      type: 'string',
    },
    quota: {
      type: 'number',
    },
    highlighted: {
      type: 'boolean',
      defaultsTo: false
    },
    users: {
      collection: 'User', //与 User 通过 events 关联
      via: 'events'
    },

  },
  
  getInvalidIdMsg: function (opts) {
    // opts = req.params
    if (typeof opts.id === "undefined" )
      return "Event id not specified."; //未传入id
    if (isNaN(parseInt(opts.id)))
      return "Event id with incorrect type." //传入的id不是数字
    return null;
  },

};

