
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const weekdayShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

type OpenData = {
    open: string,
    close: string,
    isClosed: boolean
}
type OpenTimeData = {
    all: {
        open: string;
        close: string;
        isClosed: boolean;
        isAll: boolean;
    };
    sun: OpenData;
    mon: OpenData;
    tue: OpenData;
    wed: OpenData;
    thu: OpenData;
    fri: OpenData;
    sat: OpenData;
}

function formatOpenTime(item: OpenTimeData) {
    let d = new Date
    let day = d.getDay()

    if (item.all.isAll) {
        return item.all.isClosed ? 'Closed' : (!item.all.open || !item.all.close) ?
        'Open' : weekdayShort[day] + ' '+ item.all.open + '-' + item.all.close
    } else if (day === 0) {
        return item.sun.isClosed ? 'Closed' : (!item.sun.open || !item.sun.close) ?
        'Open' : weekdayShort[day] + ' '+ item.sun.open + '-' + item.sun.close
    } else if (day === 1) {
        return item.mon.isClosed ? 'Closed' : (!item.mon.open || !item.mon.close) ?
        'Open' : weekdayShort[day] + ' '+ item.mon.open + '-' + item.mon.close
    } else if (day === 2) {
        return item.tue.isClosed ? 'Closed' : (!item.tue.open || !item.tue.close) ?
        'Open' : weekdayShort[day] + ' '+ item.tue.open + '-' + item.tue.close
    } else if (day === 3) {
        return item.wed.isClosed ? 'Closed' : (!item.wed.open || !item.wed.close) ?
        'Open' : weekdayShort[day] + ' '+ item.wed.open + '-' + item.wed.close
    } else if (day === 4) {
        return item.thu.isClosed ? 'Closed' : (!item.thu.open || !item.thu.close) ?
        'Open' : weekdayShort[day] + ' '+ item.thu.open + '-' + item.thu.close
    } else if (day === 5) {
        return item.fri.isClosed ? 'Closed' : (!item.fri.open || !item.fri.close) ?
        'Open' : weekdayShort[day] + ' '+ item.fri.open + '-' + item.fri.close
    } else if (day === 6) {
        return item.sat.isClosed ? 'Closed' : (!item.sat.open || !item.sat.close) ?
        'Open' : weekdayShort[day] + ' '+ item.sat.open + '-' + item.sat.close
    }
}

export default formatOpenTime