$(document).ready(function() {


   var $calendar = $('#calendar');
   var id = 10;

   $calendar.weekCalendar({
      timeslotsPerHour : 4,
      allowCalEventOverlap : true,
      overlapEventsSeparate: true,
      firstDayOfWeek : 1,
      businessHours :{start: 8, end: 21, limitDisplay: true },
      daysToShow : 5,
      readonly : true,
      height : function($calendar) {
         return $(window).height()*.85 - $("h1").outerHeight() - 1;
      },
      eventRender : function(calEvent, $event) {
         if (calEvent.end.getTime() < new Date().getTime()) {
            $event.css("backgroundColor", "#faa");
            $event.find(".wc-time").css({
               "backgroundColor" : "#999",
               "border" : "1px solid #888"
            });
         }
      },
      // draggable : function(calEvent, $event) {
      //    return calEvent.readOnly != true;
      // },
      // resizable : function(calEvent, $event) {
      //    return calEvent.readOnly != true;
      // },
      // eventNew : function(calEvent, $event) {
      //    var $dialogContent = $("#event_edit_container");
      //    resetForm($dialogContent);
      //    var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
      //    var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
      //    var titleField = $dialogContent.find("input[name='title']");
      //    var bodyField = $dialogContent.find("textarea[name='body']");
      //
      //
      //    $dialogContent.dialog({
      //       modal: true,
      //       title: "New Calendar Event",
      //       close: function() {
      //          $dialogContent.dialog("destroy");
      //          $dialogContent.hide();
      //          $('#calendar').weekCalendar("removeUnsavedEvents");
      //       },
      //       buttons: {
      //          save : function() {
      //             calEvent.id = id;
      //             id++;
      //             calEvent.start = new Date(startField.val());
      //             calEvent.end = new Date(endField.val());
      //             calEvent.title = titleField.val();
      //             calEvent.body = bodyField.val();
      //
      //             $calendar.weekCalendar("removeUnsavedEvents");
      //             $calendar.weekCalendar("updateEvent", calEvent);
      //             $dialogContent.dialog("close");
      //          },
      //          cancel : function() {
      //             $dialogContent.dialog("close");
      //          }
      //       }
      //    }).show();
      //
      //    $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
      //    setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
      //
      // },
      // eventDrop : function(calEvent, $event) {
      // },
      // eventResize : function(calEvent, $event) {
      // },
      // eventClick : function(calEvent, $event) {
      //
      //    if (calEvent.readOnly) {
      //       return;
      //    }
      //
      //    var $dialogContent = $("#event_edit_container");
      //    resetForm($dialogContent);
      //    var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
      //    var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
      //    var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
      //    var bodyField = $dialogContent.find("textarea[name='body']");
      //    bodyField.val(calEvent.body);
      //
      //    $dialogContent.dialog({
      //       modal: true,
      //       title: "Edit - " + calEvent.title,
      //       close: function() {
      //          $dialogContent.dialog("destroy");
      //          $dialogContent.hide();
      //          $('#calendar').weekCalendar("removeUnsavedEvents");
      //       },
      //       buttons: {
      //          save : function() {
      //
      //             calEvent.start = new Date(startField.val());
      //             calEvent.end = new Date(endField.val());
      //             calEvent.title = titleField.val();
      //             calEvent.body = bodyField.val();
      //
      //             $calendar.weekCalendar("updateEvent", calEvent);
      //             $dialogContent.dialog("close");
      //          },
      //          "delete" : function() {
      //             $calendar.weekCalendar("removeEvent", calEvent.id);
      //             $dialogContent.dialog("close");
      //          },
      //          cancel : function() {
      //             $dialogContent.dialog("close");
      //          }
      //       }
      //    }).show();
      //
      //    var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
      //    var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
      //    $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
      //    setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
      //    $(window).resize().resize(); //fixes a bug in modal overlay size ??
      //
      // },
      // eventMouseover : function(calEvent, $event) {
      // },
      // eventMouseout : function(calEvent, $event) {
      // },
      // noEvents : function() {
      //
      // },
      data : function(start, end, callback) {
         callback(getEventData());
      }
   });

   function resetForm($dialogContent) {
      $dialogContent.find("input").val("");
      $dialogContent.find("textarea").val("");
   }

   function getEventData() {
      var year = new Date().getFullYear();
      var month = new Date().getMonth();
      var dayOfMonth = new Date().getDate();
      var dayOfWeek = new Date().getDay();

      // The relitave day of the week
      var mon = dayOfMonth - dayOfWeek + 1;
      var tue = dayOfMonth - dayOfWeek + 2;
      var wed = dayOfMonth - dayOfWeek + 3;
      var thr = dayOfMonth - dayOfWeek + 4;
      var fri = dayOfMonth - dayOfWeek + 5;

      return {
         events : [
            {
               "id":1,
               "start": new Date(year, month, mon, 12),
               "end": new Date(year, month, mon, 13, 30),
               "title":"Lunch with Mike"
            },
            {
               "id":2,
               "start": new Date(year, month, tue, 14),
               "end": new Date(year, month, tue, 14, 45),
               "title":"Dev Meeting\nWith other stuff"
            },
            {
               "id":3,
               "start": new Date(year, month, wed, 17),
               "end": new Date(year, month, wed, 17, 45),
               "title":"Hair cut"
            },
            {
               "id":4,
               "start": new Date(year, month, thr, 8),
               "end": new Date(year, month, thr, 9, 30),
               "title":"Team breakfast"
            },
            {
               "id":5,
               "start": new Date(year, month, fri, 14),
               "end": new Date(year, month, fri, 15),
               "title":"Product showcase"
            },
            {
               "id":6,
               "start": new Date(year, month, fri, 10),
               "end": new Date(year, month, fri, 11),
               "title":"I'm read-only",
               readOnly : true
            }

         ]
      };
   }


   /*
    * Sets up the start and end time fields in the calendar event
    * form for editing based on the calendar event being edited
    */
   function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {

      for (var i = 0; i < timeslotTimes.length; i++) {
         var startTime = timeslotTimes[i].start;
         var endTime = timeslotTimes[i].end;
         var startSelected = "";
         if (startTime.getTime() === calEvent.start.getTime()) {
            startSelected = "selected=\"selected\"";
         }
         var endSelected = "";
         if (endTime.getTime() === calEvent.end.getTime()) {
            endSelected = "selected=\"selected\"";
         }
         $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
         $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");

      }
      $endTimeOptions = $endTimeField.find("option");
      $startTimeField.trigger("change");
   }

   var $endTimeField = $("select[name='end']");
   var $endTimeOptions = $endTimeField.find("option");

   //reduces the end time options to be only after the start time options.
   $("select[name='start']").change(function() {
      var startTime = $(this).find(":selected").val();
      var currentEndTime = $endTimeField.find("option:selected").val();
      $endTimeField.html(
            $endTimeOptions.filter(function() {
               return startTime < $(this).val();
            })
            );

      var endTimeSelected = false;
      $endTimeField.find("option").each(function() {
         if ($(this).val() === currentEndTime) {
            $(this).attr("selected", "selected");
            endTimeSelected = true;
            return false;
         }
      });

      if (!endTimeSelected) {
         //automatically select an end date 2 slots away.
         $endTimeField.find("option:eq(1)").attr("selected", "selected");
      }

   });


   var $about = $("#about");

   $("#course_codes_button").click(function() {
      $about.dialog({
         title: "Copy course codes",
         width: "50%",
         close: function() {
            $about.dialog("destroy");
            $about.hide();
         },
         buttons: {
            close : function() {
               $about.dialog("close");
            }
         }
      }).show();
   });


});
