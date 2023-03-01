var WeeklyPrescriptionIds = [{
    id: "MoWeFr",
    name: "Three times per week Mon, Wed, Friday"
},
{
    id: "TuThSa",
    name: "Three times per week Tues, Thurs, Sat"
}, {
    id: "q36h interval",
    name: "Every 36 hours from start date and time"
}, {
    id: "q48h interval",
    name: "Every 48 hours from start date and time"
}, {
    id: "Q48h",
    name: "Every other day."
}, {
    id: "Q72h interval",
    name: "Every 72 hours from start date and time"
}, {
    id: "Q3d",
    name: "Every 72 hours"
}, {
    id: "QWeek",
    name: "Every seven days"
}];

var DailyPrescription = [
    {
        id: "Once",
        list: ["1-0-0", "0-1-0", "0-0-1"]
    },
    {
        id: "Twice",
        list: ["1-0-1", "1-1-0", "0-1-1"]
    }, {
        id: "Thrice",
        list: ["1-1-1"]
    },{
        id:"SOS",
        list:["SOS"]
    },{
        id:"Hourly",
        list:["2","3","4","6","8","12"]
    },{
        id:"Weekly",
        list:["MoWeFr","TuThSa","q36h interval","q48h interval","Q48h","q72h interval","Q72h","Q3d","QWeek"]
    }

];

var WeeklyPrescription = ["MoWeFr","TuThSa","q36h interval","q48h interval","Q48h","q72h interval","Q72h","Q3d","QWeek"];

var Instructions = ["Before Food", "After Food", "Bed Time" , "Empty Stomach"];

var TabletQuantity = ["1", "1/2", "1/3", "1/4"];

var SyrupQuantity = ["2","2.5","3","3.5","4","4.5","5","5.5","6","6.5","7","7.5","8","8.5","9","9.5","10","10.5"];

var DurationType = ["Days", "Weeks", "Months"]

var Duration = [1,2,3,4,5,6,7,8,9,10,15,20,25,30,45];

export { WeeklyPrescription, Instructions, DailyPrescription, TabletQuantity, DurationType, SyrupQuantity, Duration };