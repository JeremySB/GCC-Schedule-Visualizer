//Cafeteria meal times
var mapTimes = [{
        title: 'MondayBreakfast',
        start: '2016-08-01T07:15:00',
        end: '2016-08-01T10:00:00',
        rendering: 'background'
    },
    {
        title: 'MondayLunch',
        start: '2016-08-01T11:45:00',
        end: '2016-08-01T13:45:00',
        rendering: 'background'
    },
    {
        title: 'MondayDinner',
        start: '2016-08-01T16:30:00',
        end: '2016-08-01T19:15:00',
        rendering: 'background'
    },
    {
        title: 'TuesdayBreakfast',
        start: '2016-08-02T07:15:00',
        end: '2016-08-02T10:00:00',
        rendering: 'background'
    },
    {
        title: 'TuesdayLunch',
        start: '2016-08-02T11:45:00',
        end: '2016-08-02T13:45:00',
        rendering: 'background'
    },
    {
        title: 'TuesdayDinner',
        start: '2016-08-02T16:30:00',
        end: '2016-08-02T19:15:00',
        rendering: 'background'
    },
    {
        title: 'WednesdayBreakfast',
        start: '2016-08-03T07:15:00',
        end: '2016-08-03T10:00:00',
        rendering: 'background'
    },
    {
        title: 'WednesdayLunch',
        start: '2016-08-03T11:45:00',
        end: '2016-08-03T13:45:00',
        rendering: 'background'
    },
    {
        title: 'WednesdayDinner',
        start: '2016-08-03T16:30:00',
        end: '2016-08-03T19:15:00',
        rendering: 'background'
    },
    {
        title: 'ThursdayBreakfast',
        start: '2016-08-04T07:15:00',
        end: '2016-08-04T10:00:00',
        rendering: 'background'
    },
    {
        title: 'ThursdayLunch',
        start: '2016-08-04T11:45:00',
        end: '2016-08-04T13:45:00',
        rendering: 'background'
    },
    {
        title: 'ThursdayDinner',
        start: '2016-08-04T16:30:00',
        end: '2016-08-04T19:15:00',
        rendering: 'background'
    },
    {
        title: 'FridayBreakfast',
        start: '2016-08-04T07:15:00',
        end: '2016-08-04T10:00:00',
        rendering: 'background'
    },
    {
        title: 'FridayLunch',
        start: '2016-08-05T11:45:00',
        end: '2016-08-05T13:45:00',
        rendering: 'background'
    },
];

var hicksTimes = [{
        title: 'MondayLunch',
        start: '2016-08-01T10:50:00',
        end: '2016-08-01T13:00:00',
        rendering: 'background'
    },
    {
        title: 'MondayDinner',
        start: '2016-08-01T16:00:00',
        end: '2016-08-01T18:30:00',
        rendering: 'background'
    },
    {
        title: 'TuesdayLunch',
        start: '2016-08-02T10:50:00',
        end: '2016-08-02T13:00:00',
        rendering: 'background'
    },
    {
        title: 'TuesdayDinner',
        start: '2016-08-02T16:00:00',
        end: '2016-08-02T18:30:00',
        rendering: 'background'
    },
    {
        title: 'WednesdayLunch',
        start: '2016-08-03T10:50:00',
        end: '2016-08-03T13:00:00',
        rendering: 'background'
    },
    {
        title: 'WednesdayDinner',
        start: '2016-08-03T16:00:00',
        end: '2016-08-03T18:30:00',
        rendering: 'background'
    },
    {
        title: 'ThursdayLunch',
        start: '2016-08-04T10:50:00',
        end: '2016-08-04T13:00:00',
        rendering: 'background'
    },
    {
        title: 'ThursdayDinner',
        start: '2016-08-04T16:00:00',
        end: '2016-08-04T18:30:00',
        rendering: 'background'
    },
    {
        title: 'FridayLunch',
        start: '2016-08-05T10:50:00',
        end: '2016-08-05T13:00:00',
        rendering: 'background'
    },
    {
        title: 'FridayDinner',
        start: '2016-08-05T16:00:00',
        end: '2016-08-05T19:15:00',
        rendering: 'background'
    }
];

var sacTimes = [{
        title: 'MondayBreakfast',
        start: '2016-08-01T07:00:00',
        end: '2016-08-01T09:00:00',
        rendering: 'background'
    },
    {
        title: 'MondayLunch',
        start: '2016-08-01T12:35:00',
        end: '2016-08-01T15:45:00',
        rendering: 'background'
    },
    {
        title: 'MondayDinner',
        start: '2016-08-01T16:00:00',
        end: '2016-08-01T19:30:00',
        rendering: 'background'
    },
    {
        title: 'TuesdayBreakfast',
        start: '2016-08-02T07:00:00',
        end: '2016-08-02T09:00:00',
        rendering: 'background'
    },
    {
        title: 'TuesdayLunch',
        start: '2016-08-02T12:35:00',
        end: '2016-08-02T15:45:00',
        rendering: 'background'
    },
    {
        title: 'TuesdayDinner',
        start: '2016-08-02T16:00:00',
        end: '2016-08-02T19:30:00',
        rendering: 'background'
    },
    {
        title: 'WednesdayBreakfast',
        start: '2016-08-03T07:00:00',
        end: '2016-08-03T09:00:00',
        rendering: 'background'
    },
    {
        title: 'WednesdayLunch',
        start: '2016-08-03T12:35:00',
        end: '2016-08-03T15:45:00',
        rendering: 'background'
    },
    {
        title: 'WednesdayDinner',
        start: '2016-08-03T16:00:00',
        end: '2016-08-03T19:30:00',
        rendering: 'background'
    },
    {
        title: 'ThursdayBreakfast',
        start: '2016-08-04T07:00:00',
        end: '2016-08-04T09:00:00',
        rendering: 'background'
    },
    {
        title: 'ThursdayLunch',
        start: '2016-08-04T12:35:00',
        end: '2016-08-04T15:45:00',
        rendering: 'background'
    },
    {
        title: 'ThursdayDinner',
        start: '2016-08-04T16:00:00',
        end: '2016-08-04T19:30:00',
        rendering: 'background'
    },
    {
        title: 'FridayBreakfast',
        start: '2016-08-05T07:00:00',
        end: '2016-08-05T09:00:00',
        rendering: 'background'
    },
    {
        title: 'FridayLunch',
        start: '2016-08-05T12:35:00',
        end: '2016-08-05T15:45:00',
        rendering: 'background'
    },
    {
        title: 'FridayDinner',
        start: '2016-08-05T16:00:00',
        end: '2016-08-05T17:30:00',
        rendering: 'background'
    }
];
