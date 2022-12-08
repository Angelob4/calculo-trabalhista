const hiredDate = {
    day   : $("select[name='days']"),
    months: $("select[name='months']"),
    years : $("select[name='years']"),
};

const workOutDate = {
    day   : $("select[name='work-out-days']"),
    months: $("select[name='work-out-months']"),
    years : $("select[name='work-out-years']"),
};

numberOfDaysPerMonth = {
    1 : 31,
    2 : 29,
    3 : 31,
    4 : 30,
    5 : 31,
    6 : 30,
    7 : 31,
    8 : 31,
    9 : 30,
    10 : 31,
    11 : 30,
    12 : 31,
}

function updateDaysByMonth($select){

    let selectedMonth = $select.find(':selected').val()
    
    if(!selectedMonth){
        selectedMonth = 1;
    }
    
    hiredDate.day.find('option').remove();

    hiredDate.day.append($(`<option value="0">Selecione</option>`))

    for (let index = 1; index <= numberOfDaysPerMonth[selectedMonth]; index++) {
        let $option = `<option value="${index}"> ${index}`

        hiredDate.day.append($option);
        
    }
}

const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
];

// povoa todos selected de meses
months.forEach((element, index) => {
    
    let monthNumber = index+1;

    let $option = `<option value="${monthNumber}">${element}</option>`
    hiredDate.months.append($option)
    workOutDate.months.append($option)
});

for (let index = 1950; index <= 2030; index++) {

    let isSelected = index == 2022 ? 'selected' : '';

    let $option = `<option value="${index}" ${isSelected} >${index}</option>`

    hiredDate.years.append($option);
    workOutDate.years.append($option);
}

hiredDate.months.on("change", function(){
    
    updateDaysByMonth($(this));
});


$(function(){
    
    let $self = $(this);

    updateDaysByMonth(hiredDate.day);
    updateDaysByMonth(workOutDate.day);

    

})