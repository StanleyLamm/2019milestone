/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  if (await Event.count() > 0 && await User.count() > 0) { //已经有数据就不再添加
      return;
  }

  await Event.createEach([
    {eventName: 'Culture and Politics in European Cinema', shortDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture', fullDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture Dr.mark Hampton.', imgURL: 'https://i04picsos.sogoucdn.com/a650c52ff52fe594', organizer: 'Government and International Stuides', eventDate: '2018-10-09', time: '19:30 - 21:00', venue: 'SWT 501', quota: 49, highlighted: true},
    {eventName: 'Culture and Politics in European Cinema', shortDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture', fullDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture Dr.mark Hampton.', imgURL: 'https://i04picsos.sogoucdn.com/a650c52ff52fe594', organizer: 'Government and International Stuides', eventDate: '2018-10-09', time: '19:30 - 21:00', venue: 'SWT 501', quota: 49, highlighted: true},
    {eventName: 'Culture and Politics in European Cinema', shortDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture', fullDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture Dr.mark Hampton.', imgURL: 'https://i04picsos.sogoucdn.com/a650c52ff52fe594', organizer: 'Government and International Stuides', eventDate: '2018-10-09', time: '19:30 - 21:00', venue: 'SWT 501', quota: 49, highlighted: true},
    {eventName: 'Culture and Politics in European Cinema', shortDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture', fullDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture Dr.mark Hampton.', imgURL: 'https://i04picsos.sogoucdn.com/a650c52ff52fe594', organizer: 'Government and International Stuides', eventDate: '2018-10-09', time: '19:30 - 21:00', venue: 'SWT 501', quota: 49, highlighted: true},
    {eventName: 'Culture and Politics in European Cinema', shortDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture', fullDesc: 'Michael Balcon and Twentieth Century British Cinema:Art, Industry and National Culture Dr.mark Hampton.', imgURL: 'https://i04picsos.sogoucdn.com/a650c52ff52fe594', organizer: 'Government and International Stuides', eventDate: '2018-10-09', time: '19:30 - 21:00', venue: 'SWT 501', quota: 49, highlighted: false},
  ]);

  await User.createEach([
    {username: 'admin', password: 'admin', role: 'admin'},
    {username: 'student', password: 'student', role: 'student'},
  ]);

};
