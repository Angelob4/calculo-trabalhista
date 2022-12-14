const MILLISECONDS_INTO_DAY = (1000 * 60 * 60 * 24)
const MILLISECONDS_INTO_MONTH = MILLISECONDS_INTO_DAY * 30;
const MILLISECONDS_INTO_YEAR = MILLISECONDS_INTO_MONTH * 12;

formatDate = (day, month, year) => {

    pad = (int) => {
        int = int < 10 ? '0' + int : int;
        return int
    }

    return pad(month) + ' ' + pad(day) + ' ' + year;
}

/**
 * Obtem milesegundos do tempo trabalhado desda entrada para empresa e saida da empresa
 */
const getMillisecondsWorked = () => {
    return employee.workOut.getDate() - employee.hired.getDate();
}

/**
 * converte milesegundos em mese(s)
 * @param {Numeric} milliseconds 
 */
const convertMillisecondsToMonth = (milliseconds) => {
    return milliseconds / MILLISECONDS_INTO_MONTH
}

const convertMillisecondsToYear = (milliseconds) => {
    return parseInt(milliseconds / MILLISECONDS_INTO_YEAR);
}

/**
 * Retorna quantos dias trabalhados dentro da data de saida da empresa vs entrada
 * @returns {Date}
 */
const getDaysWorked = () => {
    let days = new Date(getMillisecondsWorked());

    return (days.setDate(days.getDate() + 1)) / MILLISECONDS_INTO_DAY;
}

/**
 * retorna o cauclo de meses trabalhados
 */
const getMonthsWorked = () => {

    // subtrai a data de saida pela de entrada em millescons
    let millesconsOfDateWorked = getMillisecondsWorked();
    
    let date = new Date(millesconsOfDateWorked);
    
    millesconsOfDateWorked = date.setDate(date.getDate() + 1);
    

    return convertMillisecondsToMonth(millesconsOfDateWorked)
}

/**
 * retorna o calculo de anos trabalhados
 * @returns {Numeric}
 */
const getYearWorked = () => {
    // subtrai a data de saida pela de entrada em millescons
    let millesconsOfDateWorked = getMillisecondsWorked();

    return convertMillisecondsToYear(millesconsOfDateWorked);
}

// O objeto representando o empregado e suas configurações
const employee = {

    hired: {
        day: $("select[name='days']"),
        month: $("select[name='months']"),
        year: $("select[name='years']"),
        getDate: () => {
            let millesconsDate = formatDate(employee.hired.day.val(), employee.hired.month.val(), employee.hired.year.val());
            return new Date(millesconsDate);
        }
    },

    workOut: {
        day: $("select[name='work-out-days']"),
        month: $("select[name='work-out-months']"),
        year: $("select[name='work-out-years']"),
        getDate: () => {
            let millesconsDate = formatDate(employee.workOut.day.val(), employee.workOut.month.val(), employee.workOut.year.val());
            return new Date(millesconsDate);
        }
    },

    // retorna o tempo de trabalhado na organização
    getWorkingTime: () => {
        
        let days = getDaysWorked();
        let months = getMonthsWorked();
        let years = parseInt(getYearWorked());
        
        maxDays = getMaxDaysInMonth(employee.hired.month.val(), employee.hired.year.val());
        
        let workedDaysInFirstMonthHired = parseInt(maxDays) - parseInt(employee.hired.day.val());

        months = months > 12 ? Math.round(months - (12 * years)) : Math.round(months);

        return {
            days: employee.workOut.day.val(),
            months: months,
            years: years
        }

    }

}

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
    return employee.workOut.year.val() == employee.hired.year.val()
}

function isDatesWithSameMonth() {
    return employee.workOut.month.val() == employee.hired.month.val()
}

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
    // debugger
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

    let selectedHireMonth = employee.hired.month.find(':selected').val();
    let selectedHireYear = employee.hired.year.val();

    if (!selectedHireMonth) {
        selectedHireMonth = 1;
    }

    let maxDays = getMaxDaysInMonth(selectedHireMonth, selectedHireYear);


    employee.hired.day.find('option').remove();


    for (let index = 1; index <= maxDays; index++) {
        let $option = `<option value="${index}"> ${index}`

        employee.hired.day.append($option);
    }
}

/**
 * Popula o selector de dias da data final do trabalho
 */
function populateWorkOutDaysSelector() {

    let selectedMonth = parseInt(employee.workOut.month.val());
    let selectedYear = parseInt(employee.workOut.year.val());

    let selectedHireMonth = parseInt(employee.hired.month.val());

    let selectedHireDay = parseInt(employee.hired.day.val());
    let selectedWorkOutDay = parseInt(employee.workOut.day.val());

    let maxDays = getMaxDaysInMonth(selectedMonth, selectedYear);

    employee.workOut.day.find("option").remove();

    let isSameMonthAndYear = selectedMonth == selectedHireMonth && isDatesWithSameYear();
    let initialDay = isSameMonthAndYear ? selectedHireDay : 1


    for (let index = initialDay; index <= maxDays; index++) {
        let $option = `<option value="${index}"> ${index}`
        employee.workOut.day.append($option);
    }

    if (!selectedWorkOutDay) {
        selectedWorkOutDay = 1;
    }

    if (isDatesWithSameYear() && isDatesWithSameMonth()) {

        if (selectedWorkOutDay <= selectedHireDay) {
            employee.workOut.day.val(selectedHireDay).trigger("change");
        } else {
            employee.workOut.day.val(selectedWorkOutDay).trigger("change");
        }
    } else {
        employee.workOut.day.val(selectedWorkOutDay).trigger("change");
    }

}

/**
 * Povoa o selector de meses com todos respectivos meses
 */
function populateHireMonthSelector() {

    for (let index = 1; index <= 12; index++) {

        let $option = `<option value="${index}">${months[index]}</option>`

        employee.hired.month.append($option);
    }
}

/**
 * popula o selector de meses da data de saida do trabalho
 */
function populateWorkOutMonthSelector() {

    let initialMonth = 1;
    let currentWorkOutMonth = employee.workOut.month.val();

    employee.workOut.month.find("option").remove();

    if (isDatesWithSameYear()) {
        initialMonth = employee.hired.month.val();
    }

    for (let index = initialMonth; index <= 12; index++) {
        let $option = `<option value="${index}">${months[index]}</option>`
        employee.workOut.month.append($option);
    }

    if (currentWorkOutMonth) {

        if (isDatesWithSameYear()) {
            if (parseInt(currentWorkOutMonth) >= parseInt(employee.hired.month.val())) {
                employee.workOut.month.val(currentWorkOutMonth).trigger("change");
            }
        } else {
            employee.workOut.month.val(currentWorkOutMonth).trigger("change");
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

        employee.hired.year.append($option);
    }
}

function populateWorkOutYearSelector() {

    let hireYear = employee.hired.year.val();
    let workOutYear = employee.workOut.year.val();

    let maxYear = employee.hired.year.find("option:last-child").val();

    employee.workOut.year.find("option").remove()

    for (let year = hireYear; year <= maxYear; year++) {

        let isSelected = year == workOutYear && workOutYear >= hireYear;

        let $option = `<option value="${year}" >${year}</option>`

        employee.workOut.year.prepend($option);

        if (isSelected) {
            employee.workOut.year.val(workOutYear).trigger('change');
        }
    }
}



employee.hired.year.on("change", () => {
    populateWorkOutYearSelector();
    employee.hired.month.trigger("change");
})

employee.hired.month.on("change", function () {
    populateHireDaysSelector();
    employee.workOut.year.trigger("change");

});

employee.hired.day.on("change", () => {
    employee.workOut.month.trigger("change");
})

employee.workOut.year.on("change", () => {
    populateWorkOutMonthSelector();
    employee.workOut.month.trigger("change");
})

employee.workOut.month.on("change", () => {
    populateWorkOutDaysSelector();
    employee.workOut.day.trigger("change");
})

employee.workOut.day.on("change", () => {
    employee.getWorkingTime();

    console.log(employee.getWorkingTime())

})

/**
 * função que executao após carregamento total da página.
 */
$(function () {

    populateHireYearSelector();
    populateWorkOutYearSelector();

    populateHireMonthSelector();
    populateWorkOutMonthSelector();

    populateHireDaysSelector();
    populateWorkOutDaysSelector();

})