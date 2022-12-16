const MILLISECONDS_INTO_DAY = (1000 * 60 * 60 * 24)
const MILLISECONDS_INTO_MONTH = MILLISECONDS_INTO_DAY * 30;
const MILLISECONDS_INTO_YEAR = MILLISECONDS_INTO_MONTH * 12;

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
 * formata a data colocando um digito 0 no inicio para numeros medores que 10
 */
formatDate = (day, month, year) => {

    pad = (int) => {
        int = int < 10 ? '0' + int : int;
        return int
    }

    return pad(month) + ' ' + pad(day) + ' ' + year;
}

/**
 * função que executao após carregamento total da página.
 */
$(function () {

    let $self = $(this);

    let $lastSalaryInput = $self.find("input[name=money]");
    let $familyDepedentinput = $self.find("input[name=qty-depedent]");
    
    let $hiredDaySelector = $self.find("select[name='days']");
    let $hiredMonthSelector = $self.find("select[name='months']");
    let $hiredYearSelector = $self.find("select[name='years']");
    
    let $workOutDaySelector = $self.find("select[name='work-out-days']");
    let $workOutMonthSelector = $self.find("select[name='work-out-months']");
    let $workOutYearSelector = $self.find("select[name='work-out-years']");
    
    let $noticeSelector = $self.find("select[name=notice]");
    let $reasonForRemovalSelector = $self.find("select[name=reason");


    let grossSalary;
    let timeWorked;
    let familyDepedent;
    let selectedReason;
    let notice;
    let vacation;
    
    /**
     * evento para o input de salario
     */
    $lastSalaryInput.on("change, keyup", function() {
        grossSalary = $lastSalaryInput.val();
    })

    /**
     * evento para selector de razao de saida
     */
    $reasonForRemovalSelector.on("change", function(){
        selectedReason = $reasonForRemovalSelector.val();
    })

    /**
     * evento de quantidade de dependentes
     */
    $familyDepedentinput.on("change, keyup", function(){
        familyDepedent = $familyDepedentinput.val();
    })
    
    /**
     * evento aviso previo
     */
    $noticeSelector.on("change", function(){
        notice = $noticeSelector.val();
    })

    /**
     * calcula férias
     */
    calculateVacation = () => {
        // TODO
        // if(console.log(timeWorked, ))
    }

    /**
     * retorna o tempo de trabalhado na organização
     * @returns {Object}
     */
    calculateWorkingTime = () => {

        let days = getDaysWorked();
        let months = getMonthsWorked();
        let years = parseInt(getYearWorked());

        maxDays = getMaxDaysInMonth($hiredMonthSelector.val(), $hiredYearSelector.val());

        let workedDaysInFirstMonthHired = parseInt(maxDays) - parseInt($hiredDaySelector.val());

        months = months > 12 ? Math.round(months - (12 * years)) : Math.round(months);

        timeWorked = {
            days: $workOutDaySelector.val(),
            months: months,
            years: years
        }

    }

    getDate = ($daySelector, $monthSelector, $yearSelector) => {
        let millesconsDate = formatDate($daySelector.val(), $monthSelector.val(), $yearSelector.val());
        return new Date(millesconsDate);
    }
    
    getHiredDate = () => {
        return getDate($hiredDaySelector, $hiredMonthSelector, $hiredYearSelector);
    }
    
    getWorkOutDate = () => {
        return getDate($workOutDaySelector, $workOutMonthSelector, $workOutYearSelector);
    }

    /**
     * Obtem milesegundos do tempo trabalhado desda entrada para empresa e saida da empresa
     */
    const getMillisecondsWorked = () => {
        return getWorkOutDate() - getHiredDate();
    }

    /**
     * converte milesegundos em mese(s)
     * @param {Float} milliseconds 
     */
    const convertMillisecondsToMonth = (milliseconds) => {
        return milliseconds / MILLISECONDS_INTO_MONTH
    }

    /**
     * converte milesegundos em ano(s)
     * @param {Float} milliseconds 
     * @returns 
     */
    const convertMillisecondsToYear = (milliseconds) => {
        return parseInt(milliseconds / MILLISECONDS_INTO_YEAR);
    }

    /**
     * Retorna quantos dias trabalhados dentro da data de saida da empresa vs entrada
     * @returns {*}
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

    /**
     * retorna verdadeiro ou falso se entre as duas datas está no mesmo ano selecioado
     * @returns {Boolean} Boolean
     */
    function isDatesWithSameYear() {
        return $workOutYearSelector.val() == $hiredYearSelector.val()
    }

    /**
     * retorna verdadeiro o ufalso se entre as duas datas está com mesmo mês
     * @returns {Boolean} Boolean
     */
    function isDatesWithSameMonth() {
        return $workOutMonthSelector.val() == $hiredMonthSelector.val()
    }

    /**
     * Retorna se o ano é bicesto
     * @param {Number} year 
     * @returns {Boolean} Boolean
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
     * Atualiza e povo o select de dias
     */
    function populateHireDaysSelector() {

        let selectedHireMonth = $hiredMonthSelector.find(':selected').val();
        let selectedHireYear = $hiredYearSelector.val();

        if (!selectedHireMonth) {
            selectedHireMonth = 1;
        }

        let maxDays = getMaxDaysInMonth(selectedHireMonth, selectedHireYear);


        $hiredDaySelector.find('option').remove();


        for (let index = 1; index <= maxDays; index++) {
            let $option = `<option value="${index}"> ${index}`

            $hiredDaySelector.append($option);
        }
    }

    /**
     * Povoa o selector de meses com todos respectivos meses
     */
    function populateHireMonthSelector() {

        for (let index = 1; index <= 12; index++) {

            let $option = `<option value="${index}">${months[index]}</option>`

            $hiredMonthSelector.append($option);
        }
    }

    /**
     * Povoa o seletor de ano de contrataçao do empregado
     */
    function populateHireYearSelector() {

        for (let index = 1970; index <= 2050; index++) {

            let isSelected = index == 2022 ? 'selected' : '';

            let $option = `<option value="${index}" ${isSelected} >${index}</option>`

            $hiredYearSelector.append($option);
        }
    }

    /**
     * Popula o selector de dias da data final do trabalho
     */
    function populateWorkOutDaysSelector() {

        let selectedMonth = parseInt($workOutMonthSelector.val());
        let selectedYear = parseInt($workOutYearSelector.val());

        let selectedHireMonth = parseInt($hiredMonthSelector.val());

        let selectedHireDay = parseInt($hiredDaySelector.val());
        let selectedWorkOutDay = parseInt($workOutDaySelector.val());

        let maxDays = getMaxDaysInMonth(selectedMonth, selectedYear);

        $workOutDaySelector.find("option").remove();

        let isSameMonthAndYear = selectedMonth == selectedHireMonth && isDatesWithSameYear();
        let initialDay = isSameMonthAndYear ? selectedHireDay : 1


        for (let index = initialDay; index <= maxDays; index++) {
            let $option = `<option value="${index}"> ${index}`
            $workOutDaySelector.append($option);
        }

        if (!selectedWorkOutDay) {
            selectedWorkOutDay = 1;
        }

        if (isDatesWithSameYear() && isDatesWithSameMonth()) {

            if (selectedWorkOutDay <= selectedHireDay) {
                $workOutDaySelector.val(selectedHireDay).trigger("change");
            } else {
                $workOutDaySelector.val(selectedWorkOutDay).trigger("change");
            }
        } else {
            $workOutDaySelector.val(selectedWorkOutDay).trigger("change");
        }

    }

    /**
     * popula o selector de meses da data de saida do trabalho
     */
    function populateWorkOutMonthSelector() {

        let initialMonth = 1;
        let currentWorkOutMonth = $workOutMonthSelector.val();

        $workOutMonthSelector.find("option").remove();

        if (isDatesWithSameYear()) {
            initialMonth = $hiredMonthSelector.val();
        }

        for (let index = initialMonth; index <= 12; index++) {
            let $option = `<option value="${index}">${months[index]}</option>`
            $workOutMonthSelector.append($option);
        }

        if (currentWorkOutMonth) {

            if (isDatesWithSameYear()) {
                if (parseInt(currentWorkOutMonth) >= parseInt($hiredMonthSelector.val())) {
                    $workOutMonthSelector.val(currentWorkOutMonth).trigger("change");
                }
            } else {
                $workOutMonthSelector.val(currentWorkOutMonth).trigger("change");
            }

        }

    }

    /**
     * povoa o selector de anos da data de saida da empresa
     */
    function populateWorkOutYearSelector() {

        let hireYear = $hiredYearSelector.val();
        let workOutYear = $workOutYearSelector.val();

        let maxYear = $hiredYearSelector.find("option:last-child").val();

        $workOutYearSelector.find("option").remove()

        for (let year = hireYear; year <= maxYear; year++) {

            let isSelected = year == workOutYear && workOutYear >= hireYear;

            let $option = `<option value="${year}" >${year}</option>`

            $workOutYearSelector.prepend($option);

            if (isSelected) {
                $workOutYearSelector.val(workOutYear).trigger('change');
            }
        }
    }

    // povoa os selectes de anos
    populateHireYearSelector();
    populateWorkOutYearSelector();

    // povoa os selectes de de meses
    populateHireMonthSelector();
    populateWorkOutMonthSelector();

    // povoa os selectes de dias
    populateHireDaysSelector();
    populateWorkOutDaysSelector();

    /**
     * evento no selector de ano de contratação
     */
    $hiredYearSelector.on("change", () => {
        populateWorkOutYearSelector();
        $hiredMonthSelector.trigger("change");
    })

    /**
     * evento de selector de mes de contratação
     */
    $hiredMonthSelector.on("change", function () {
        populateHireDaysSelector();
        $workOutYearSelector.trigger("change");

    });

    /**
     * evento de selector de dias da contratação
     */
    $hiredDaySelector.on("change", () => {
        $workOutMonthSelector.trigger("change");
    })

    /**
     * evento do selector de anos de saida do emprego
     */
    $workOutYearSelector.on("change", () => {
        populateWorkOutMonthSelector();
        $workOutMonthSelector.trigger("change");
    })

    /**
     * evento do selector de mes de saida do emprego
     */
    $workOutMonthSelector.on("change", () => {
        populateWorkOutDaysSelector();
        $workOutDaySelector.trigger("change");
    })

    /**
     * evento do selector de dia de saida do emprego
     */
    $workOutDaySelector.on("change", () => {

       calculateWorkingTime();
       calculateVacation();
    })

    $hiredDaySelector.trigger("change");

})