// Tips Tour instantiation
var tips = new Tour({
    name: "tips",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>&laquo; Prev</button><button class='btn btn-default' data-role='next'>Next &#187;</button><button class='btn btn-default' data-role='end'>Close tips</button></div></div>",
    storage: false,
    steps: [{
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #1",
        content: "Be sure to always use a wired ethernet connection when scheduling."
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #2",
        content: "A full-time GCC student pays the same amount of tuition for a 13 credit semester as they do a 17 credit one. Spend that money wisely!"
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #3",
        content: "If you do have to use Wi-Fi, do so in an unpopulated area, like the crawspace beneath Harbison Chapel."
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #4",
        content: "Make sure that you're on the course code tab on myGCC's academics page and NOT the referance code tab."
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #5",
        content: "Don't let another person schedule for you; if you want something done right then use our software."
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #6",
        content: "Use a power cord to make sure your computer is running as fast as it can (don't schedule on power saving mode!)."
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #7",
        content: "HTML element inspection... that's all."
    }
    ]
});

// Tutorial Tour instantiation
var tutorial = new Tour({
    name: "tutorial",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>&laquo; Prev</button><button class='btn btn-default' data-role='next'>Next &#187;</button><button class='btn btn-default' data-role='end'>Close tutorial</button></div></div>",
    steps: [{
        element: ".search-row",
        placement: "auto right",
        backdrop: "true",
        title: "Step #1",
        content: "Use this search bar to look for things like COMP 340, computer science, or operating systems."
    },
    {
        element: ".form-group.row",
        placement: "auto right",
        backdrop: "true",
        title: "Step #2",
        content: "Filter your results even further with these awesome filters, provided free of charge!"
    },
    {
        element: ".results-row",
        placement: "auto top",
        backdrop: "true",
        title: "Step #3",
        content: "Watch as all the courses matching your search criteria appear here on the results tab. " +
        "You can add them to your schedule just by clicking on them! " +
        "Flip over to the selected courses tab to see the courses you have added. You can also remove courses by clicking on them from there too."
    },
    {
        element: "#calendar",
        placement: "auto left",
        backdrop: "true",
        title: "Step #4",
        content: "Here's were you can see all your selected courses on a real calendar. You can click on any of the courses to see some more info and to remove them from the calendar."
    },
    {
        element: "#buttons",
        placement: "auto top",
        backdrop: "true",
        backdropPadding: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        },
        title: "Step #5",
        content: "You can easily add any of the on-campus dinning options to the calendar here to see how they line up with the schedule you're considering."
    },
    {
        element: "#tips_button",
        placement: "auto top",
        backdrop: "true",
        backdropPadding: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
    },
        title: "Step #6",
        content: "Here's were you can view some sweet tips about scheduling, courtesy of your local tip chef Bobby Brown."
    },
    {
        element: "#reset_button",
        placement: "auto top",
        backdrop: "true",
        backdropPadding: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        },
        title: "Step #7",
        content: "If you feel the need to erase everything you have ever worked for then you came to the wrong place. " +
        "But if you want to start your schedule over again, you can simply click this button."
    },
    {
        element: "#course_codes_button",
        placement: "auto top",
        backdrop: "true",
        backdropPadding: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        },
        title: "Step #8",
        content: "At the end of the day, you'll need to click this button to actually get the information you'll have to paste into myGCC's academic page to add the courses you've pick out. " +
        "Good luck and see you next time, space cowboy."
    }
    ]
});


//Cafeteria meal times
var mapTimes = [{
    title: 'MondayBreakfast',
    id: 'map',
    start: '2016-08-01T07:15:00',
    end: '2016-08-01T10:00:00',
    rendering: 'background'
},
{
    title: 'MondayLunch',
    id: 'map',
    start: '2016-08-01T11:45:00',
    end: '2016-08-01T13:45:00',
    rendering: 'background'
},
{
    title: 'MondayDinner',
    id: 'map',
    start: '2016-08-01T16:30:00',
    end: '2016-08-01T19:15:00',
    rendering: 'background'
},
{
    title: 'TuesdayBreakfast',
    id: 'map',
    start: '2016-08-02T07:15:00',
    end: '2016-08-02T10:00:00',
    rendering: 'background'
},
{
    title: 'TuesdayLunch',
    id: 'map',
    start: '2016-08-02T11:45:00',
    end: '2016-08-02T13:45:00',
    rendering: 'background'
},
{
    title: 'TuesdayDinner',
    id: 'map',
    start: '2016-08-02T16:30:00',
    end: '2016-08-02T19:15:00',
    rendering: 'background'
},
{
    title: 'WednesdayBreakfast',
    id: 'map',
    start: '2016-08-03T07:15:00',
    end: '2016-08-03T10:00:00',
    rendering: 'background'
},
{
    title: 'WednesdayLunch',
    id: 'map',
    start: '2016-08-03T11:45:00',
    end: '2016-08-03T13:45:00',
    rendering: 'background'
},
{
    title: 'WednesdayDinner',
    id: 'map',
    start: '2016-08-03T16:30:00',
    end: '2016-08-03T19:15:00',
    rendering: 'background'
},
{
    title: 'ThursdayBreakfast',
    id: 'map',
    start: '2016-08-04T07:15:00',
    end: '2016-08-04T10:00:00',
    rendering: 'background'
},
{
    title: 'ThursdayLunch',
    id: 'map',
    start: '2016-08-04T11:45:00',
    end: '2016-08-04T13:45:00',
    rendering: 'background'
},
{
    title: 'ThursdayDinner',
    id: 'map',
    start: '2016-08-04T16:30:00',
    end: '2016-08-04T19:15:00',
    rendering: 'background'
},
{
    title: 'FridayBreakfast',
    id: 'map',
    start: '2016-08-05T07:15:00',
    end: '2016-08-05T10:00:00',
    rendering: 'background'
},
{
    title: 'FridayLunch',
    id: 'map',
    start: '2016-08-05T11:45:00',
    end: '2016-08-05T13:45:00',
    rendering: 'background'
},
];

var hicksTimes = [{
    title: 'MondayLunch',
    id: 'hicks',
    start: '2016-08-01T10:50:00',
    end: '2016-08-01T13:00:00',
    rendering: 'background'
},
{
    title: 'MondayDinner',
    id: 'hicks',
    start: '2016-08-01T16:00:00',
    end: '2016-08-01T18:30:00',
    rendering: 'background'
},
{
    title: 'TuesdayLunch',
    id: 'hicks',
    start: '2016-08-02T10:50:00',
    end: '2016-08-02T13:00:00',
    rendering: 'background'
},
{
    title: 'TuesdayDinner',
    id: 'hicks',
    start: '2016-08-02T16:00:00',
    end: '2016-08-02T18:30:00',
    rendering: 'background'
},
{
    title: 'WednesdayLunch',
    id: 'hicks',
    start: '2016-08-03T10:50:00',
    end: '2016-08-03T13:00:00',
    rendering: 'background'
},
{
    title: 'WednesdayDinner',
    id: 'hicks',
    start: '2016-08-03T16:00:00',
    end: '2016-08-03T18:30:00',
    rendering: 'background'
},
{
    title: 'ThursdayLunch',
    id: 'hicks',
    start: '2016-08-04T10:50:00',
    end: '2016-08-04T13:00:00',
    rendering: 'background'
},
{
    title: 'ThursdayDinner',
    id: 'hicks',
    start: '2016-08-04T16:00:00',
    end: '2016-08-04T18:30:00',
    rendering: 'background'
},
{
    title: 'FridayLunch',
    id: 'hicks',
    start: '2016-08-05T10:50:00',
    end: '2016-08-05T13:00:00',
    rendering: 'background'
},
{
    title: 'FridayDinner',
    id: 'hicks',
    start: '2016-08-05T16:00:00',
    end: '2016-08-05T19:30:00',
    rendering: 'background'
}
];

var sacTimes = [{
    title: 'MondayBreakfast',
    id: 'sac',
    start: '2016-08-01T07:00:00',
    end: '2016-08-01T09:00:00',
    rendering: 'background'
},
{
    title: 'MondayLunch',
    id: 'sac',
    start: '2016-08-01T12:45:00',
    end: '2016-08-01T15:45:00',
    rendering: 'background'
},
{
    title: 'MondayDinner',
    id: 'sac',
    start: '2016-08-01T16:00:00',
    end: '2016-08-01T19:30:00',
    rendering: 'background'
},
{
    title: 'TuesdayBreakfast',
    id: 'sac',
    start: '2016-08-02T07:00:00',
    end: '2016-08-02T09:00:00',
    rendering: 'background'
},
{
    title: 'TuesdayLunch',
    id: 'sac',
    start: '2016-08-02T12:45:00',
    end: '2016-08-02T15:45:00',
    rendering: 'background'
},
{
    title: 'TuesdayDinner',
    id: 'sac',
    start: '2016-08-02T16:00:00',
    end: '2016-08-02T19:30:00',
    rendering: 'background'
},
{
    title: 'WednesdayBreakfast',
    id: 'sac',
    start: '2016-08-03T07:00:00',
    end: '2016-08-03T09:00:00',
    rendering: 'background'
},
{
    title: 'WednesdayLunch',
    id: 'sac',
    start: '2016-08-03T12:45:00',
    end: '2016-08-03T15:45:00',
    rendering: 'background'
},
{
    title: 'WednesdayDinner',
    id: 'sac',
    start: '2016-08-03T16:00:00',
    end: '2016-08-03T19:30:00',
    rendering: 'background'
},
{
    title: 'ThursdayBreakfast',
    id: 'sac',
    start: '2016-08-04T07:00:00',
    end: '2016-08-04T09:00:00',
    rendering: 'background'
},
{
    title: 'ThursdayLunch',
    id: 'sac',
    start: '2016-08-04T12:45:00',
    end: '2016-08-04T15:45:00',
    rendering: 'background'
},
{
    title: 'ThursdayDinner',
    id: 'sac',
    start: '2016-08-04T16:00:00',
    end: '2016-08-04T19:30:00',
    rendering: 'background'
},
{
    title: 'FridayBreakfast',
    id: 'sac',
    start: '2016-08-05T07:00:00',
    end: '2016-08-05T09:00:00',
    rendering: 'background'
},
{
    title: 'FridayLunch',
    id: 'sac',
    start: '2016-08-05T12:45:00',
    end: '2016-08-05T15:45:00',
    rendering: 'background'
},
{
    title: 'FridayDinner',
    id: 'sac',
    start: '2016-08-05T16:00:00',
    end: '2016-08-05T19:30:00',
    rendering: 'background'
}
];
