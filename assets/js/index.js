const hiredDate = {
    day: $("select[name='days']"),
    months: $("select[name='months']"),
    years: $("select[name='years']"),
};

const workOutDate = {
    day: $("select[name='work-out-days']"),
    months: $("select[name='work-out-months']"),
    years: $("select[name='work-out-years']"),
};

const months = {
    1: 'janeiro',
    2: 'fevereiro',
    3: 'março',
    4: 'abril',
    5: 'maio',
    6: 'junho',
    7: 'julho',
    8: 'agosto',
    9: 'setembro',
    10: 'outubro',
    11: 'novembro',
    12: 'dezembro',
};

function isDatesWithSameYear() {
    return workOutDate.years.val() == hiredDate.years.val()
}

function isDatesWithSameMonth() {
    return workOutDate.months.val() == hiredDate.months.val()
}

// function calcDate() {
    
//     let monthWorked;

//     let employee = {

//         hiredDate: {
//             'day': hiredDate.day.val(),
//             'month': hiredDate.months.val(),
//             'year': hiredDate.years.val(),
//         },

//         lastWorkedDate: {
//             'day': workOutDate.day.val(),
//             'month': workOutDate.months.val(),
//             'year': workOutDate.years.val()
//         },
//     }
    
//     monthWorked = parseInt(employee.lastWorkedDate.month) - parseInt(employee.hiredDate.month);
//     let workedDays;

//     let maxDaysInMonth = getMaxDaysInMonth(employee.lastWorkedDate.month, employee.lastWorkedDate.year)

//     workedDays = parseInt(maxDaysInMonth) - parseIntI(employee.lastWorkedDate.day)

//     for (let months = monthWorked; months <= 12; months++) {
       
        
//     }
    
//     yearsWorked = parseInt(employee.lastWorkedDate.year) - parseInt(employee.hiredDate.year);

    
//     // if(isDatesWithSameMonth() && isDatesWithSameYear()){
//     //     daysWorked =  parseInt(employee.lastWorkedDate.day) - parseInt(employee.hiredDate.day);
//     // } else {
//     //     employee.lastWorkedDate.day
//     // }

//     console.log("você trabalhou: " + yearsWorked + " ano, " + monthWorked + " meses e " + daysWorked + " dias");

// }


/**
 * Retorna se o ano é bicesto
 * @param {Number} year 
 * @returns Boolean
 */
function isBicestYear(year) {

    if (year % 4 == 0) {
        if (year % 100 == 0) {
            if (year % 400 == 0) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    } else {
        false
    }
}

/**
 * Retorna quantos dias tem um determinado mes, mesmo que o ano seja bicesto
 * @param {Number} mounth 
 * @param {Number} year 
 * @returns Number
 */
function getMaxDaysInMonth(mounth, year) {

    let daysInMonth = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    }

    if (mounth == 2) {
        if (isBicestYear(year)) {
            return 29
        }
    }

    return daysInMonth[mounth]

}

/**
 * Atualiza e povo o select de dias
 */
function populateHireDaysSelector() {

    let selectedHireMonth = hiredDate.months.find(':selected').val();
    let selectedHireYear = hiredDate.years.val();

    if (!selectedHireMonth) {
        selectedHireMonth = 1;
    }

    let maxDays = getMaxDaysInMonth(selectedHireMonth, selectedHireYear);


    hiredDate.day.find('option').remove();


    for (let index = 1; index <= maxDays; index++) {
        let $option = `<option value="${index}"> ${index}`

        hiredDate.day.append($option);
    }
}

/**
 * Popula o selector de dias da data final do trabalho
 */
function populateWorkOutDaysSelector() {

    let selectedMonth = parseInt(workOutDate.months.val());
    let selectedYear = parseInt(workOutDate.years.val());

    let selectedHireMonth = parseInt(hiredDate.months.val());

    let selectedHireDay = parseInt(hiredDate.day.val());
    let selectedWorkOutDay = parseInt(workOutDate.day.val());

    let maxDays = getMaxDaysInMonth(selectedMonth, selectedYear);

    workOutDate.day.find("option").remove();

    let isSameMonthAndYear = selectedMonth == selectedHireMonth && isDatesWithSameYear();
    let initialDay = isSameMonthAndYear ? selectedHireDay : 1


    for (let index = initialDay; index <= maxDays; index++) {
        let $option = `<option value="${index}"> ${index}`
        workOutDate.day.append($option);
    }

    if (!selectedWorkOutDay) {
        selectedWorkOutDay = 1;
    }

    if (isDatesWithSameYear() && isDatesWithSameMonth()) {

        if (selectedWorkOutDay <= selectedHireDay) {
            workOutDate.day.val(selectedHireDay).trigger("change");
        } else {
            workOutDate.day.val(selectedWorkOutDay).trigger("change");
        }
    } else {
        workOutDate.day.val(selectedWorkOutDay).trigger("change");
    }

}

/**
 * Povoa o selector de meses com todos respectivos meses
 */
function populateHireMonthSelector() {

    for (let index = 1; index <= 12; index++) {

        let $option = `<option value="${index}">${months[index]}</option>`

        hiredDate.months.append($option);
    }
}

/**
 * popula o selector de meses da data de saida do trabalho
 */
function populateWorkOutMonthSelector() {

    let initialMonth = 1;
    let currentWorkOutMonth = workOutDate.months.val();

    workOutDate.months.find("option").remove();

    if (isDatesWithSameYear()) {
        initialMonth = hiredDate.months.val();
    }

    for (let index = initialMonth; index <= 12; index++) {
        let $option = `<option value="${index}">${months[index]}</option>`
        workOutDate.months.append($option);
    }

    if (currentWorkOutMonth) {

        if (isDatesWithSameYear()) {
            if (parseInt(currentWorkOutMonth) >= parseInt(hiredDate.months.val())) {
                workOutDate.months.val(currentWorkOutMonth).trigger("change");
            }
        } else {
            workOutDate.months.val(currentWorkOutMonth).trigger("change");
        }

    }

}

/**
 * Povoa o selector de ano com todos respectivos ano pre definidos
 */
function populateHireYearSelector() {

    for (let index = 1950; index <= 2050; index++) {

        let isSelected = index == 2022 ? 'selected' : '';

        let $option = `<option value="${index}" ${isSelected} >${index}</option>`

        hiredDate.years.append($option);
    }
}

function populateWorkOutYearSelector() {

    let hireYear = hiredDate.years.val();
    let workOutYear = workOutDate.years.val();

    let maxYear = hiredDate.years.find("option:last-child").val();

    workOutDate.years.find("option").remove()

    for (let year = hireYear; year <= maxYear; year++) {

        let isSelected = year == workOutYear && workOutYear >= hireYear;

        let $option = `<option value="${year}" >${year}</option>`

        workOutDate.years.prepend($option);

        if (isSelected) {
            workOutDate.years.val(workOutYear).trigger('change');
        }
    }
}



hiredDate.years.on("change", () => {
    populateWorkOutYearSelector();
    hiredDate.months.trigger("change");
})

hiredDate.months.on("change", function () {
    populateHireDaysSelector();
    workOutDate.years.trigger("change");
    
});

hiredDate.day.on("change", () => {
    workOutDate.months.trigger("change");
})

workOutDate.years.on("change", () => {
    populateWorkOutMonthSelector();
    workOutDate.months.trigger("change");
})

workOutDate.months.on("change", () => {
    populateWorkOutDaysSelector();
    workOutDate.day.trigger("change");
})

workOutDate.day.on("change", () => {
    calcDate();
})

/**
 * função que executao após carregamento total da página.
 */
$(function () {

    let $self = $(this);

    populateHireYearSelector();
    populateWorkOutYearSelector();

    populateHireMonthSelector();
    populateWorkOutMonthSelector();

    populateHireDaysSelector();
    populateWorkOutDaysSelector();

    calcDate();



})