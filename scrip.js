var arWeekHours=[5, 21, 17, 10, 2, 26];

//Работа prompt и alert
var nam=prompt("Как вас зовут?", "Имя");
if (nam !== null) {
    alert("Приветствую, " + nam + "!");
}
else{
    alert("Представьтесь в следующий раз :)");
}

//Цикл с маленьким числом часов
var counOfLowHours = 0;
for (var i=0; i<arWeekHours.length; i++){
    if (arWeekHours[i]<=5) counOfLowHours++;
}
procOfLowHours = counOfLowHours/arWeekHours.length*100;

//Функция суммирования
function sumHour(hours) {
    var res=0;
    for (var index = 0; index < hours.length; index++) {
        res = res + hours[index];
    }
    return res;
}

//Функция фильтрации
function filtWeeks(hours) {
    var count = 0;
    for (var i=0; i< hours.length; i++){
        if (hours[i]>15) count++;
    }
    return count;
}

//Поиск максимума
function maxHour(hours){
    var maxh=hours[0];
    for (var i=1; i< hours.length; i++){
        if (hours[i]>maxh) maxh=hours[i];
    }
    return maxh;
}

alert("Всего отработано " + sumHour(arWeekHours) + " часов, в " + filtWeeks(arWeekHours)+ " неделях нагрузка была высокой.");

//Вывод в консоль
console.log("Процент недель с малым участием: "+procOfLowHours + ". Количество таких недель: " +counOfLowHours);

//Дополнительное задание
if (sumHour(arWeekHours) > 50) {
    console.log("Вы настоящий герой общества!");
}

