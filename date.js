module.exports=getDate;
function getDate() {
    var today = new Date();
    var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    var option = {
        weekday: "long",
        day: "numeric",
        month: "long"

    };

    var day = today.toLocaleDateString("en-us", option);
    return day;
}