var size = 5;
var generation = 0;
var maxPackValue = 33554431;
var field = matrix(size, size, 0);
var field_next = matrix(size, size, 0);
var field_values = [];
function matrix(rows, cols, defaultValue = false) {
    var arr = [];
    for (var i = 0; i < rows; i++) {
        arr.push([]);
        arr[i].push(new Array(cols));
        for (var j = 0; j < cols; j++) {
            arr[i][j] = (defaultValue === false) ? getRandom(0, 1) : defaultValue;
        }
    }

    return arr;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;

}


$(document).ready(function () {
    refreshGameField();
    var intervalId;
    $(".next_step").bind("click", function (event) {

        if(step()===false) {
            alert('Game Over за '+generation+' шагов');
        generation = 0;
        field_values = [];
        }
    });
    $(".random").bind("click", function (event) {
        generation = 0;
        field = matrix(size, size);
        refreshGameField();

    });
    $(".clear_field").bind("click", function (event) {
        generation = 0;
        field = matrix(size, size, 0);
        field_next = matrix(size, size, 0);
        refreshGameField();
    });

    $(".run").bind("click", function (event) {
        intervalId = setInterval(function () {
            if(step()===false) {
                clearInterval(intervalId);
                alert('Game Over за '+generation+' шагов');
            generation =0;
                field_values = [];
            }
        }, 100);
    });
    $(".stop").bind("click", function (event) {
        clearInterval(intervalId);
    });
    $(".pack").bind("click", function (event) {
        var unpackValue = document.getElementById('test').value;
        if (!(/^\+?\d+$/.test(unpackValue) && (+unpackValue<=maxPackValue))) {alert('Неверно введенное число. Введите десятичное' +
            ' число в диапазоне от 0 до '+maxPackValue+'((2^25)-1)');}
            else {
            string2Array(document.getElementById('test').value);
            refreshGameField();
        }
    });
    $(".unpack").bind("click", function (event) {
        var packValue = array2String();
        document.getElementById('test').value = packValue;
        //alert(array2String());
    });

});

function cellClickHandler(el) {
    var ar = JSON.parse(el.id);
    var i = ar[0];
    var j = ar[1];
    var color = '#bbb';
    if (field[i][j] === 0) {
        color = 'yellow';
        field[i][j] = 1;
    } else {
        field[i][j] = 0;
    }
    $(el).attr('style', 'background: ' + color);
}

function step() {
    var before = array2String();
    field_values[generation] = array2String();
    for(var i = 0;i<field_values.length;i++){
        if((field_values[generation]==field_values[i]) && (generation != i) || field_values[generation]==0) return false;
    }
    generation++;
    for (var i = 0; i < field.length; i++)
        for (var j = 0; j < field.length; j++) {
            var neighbors_count = 0;
            if (checkIndex(i, j + 1))
                neighbors_count += (field[i][j + 1] === 0) ? 0 : 1;
            if (checkIndex(i, j - 1))
                neighbors_count += (field[i][j - 1] === 0) ? 0 : 1;

            if (checkIndex(i - 1, j + 1))
                neighbors_count += (field[i - 1][j + 1] === 0) ? 0 : 1;
            if (checkIndex(i - 1, j))
                neighbors_count += (field[i - 1][j] === 0) ? 0 : 1;
            if (checkIndex(i - 1, j - 1))
                neighbors_count += (field[i - 1][j - 1] === 0) ? 0 : 1;

            if (checkIndex(i + 1, j + 1))
                neighbors_count += (field[i + 1][j + 1] === 0) ? 0 : 1;
            if (checkIndex(i + 1, j))
                neighbors_count += (field[i + 1][j] === 0) ? 0 : 1;
            if (checkIndex(i + 1, j - 1))
                neighbors_count += (field[i + 1][j - 1] === 0) ? 0 : 1;

            if (neighbors_count === 3 || (neighbors_count === 2
                && field[i][j] === 1)) {
                field_next[i][j] = 1;
                refreshFieldElement('[' + i + ',' + j + ']', 'blue');
            }
            else {
                field_next[i][j] = 0;
                refreshFieldElement('[' + i + ',' + j + ']', '#bbbbbb');
            }
        }
    field = field_next;
    var after = array2String();
    if(before == after) return false;
    field_next = matrix(size, size, 0);
    return true;
}

function checkIndex(i, j) {
    if ((i >= 0 && i <= field.length - 1) && (j >= 0 && j <= field.length - 1)) {
        return true;
    }
}

function refreshGameField() {
    document.getElementById('gen').innerHTML = generation;
    var str = '';
    for (var i = 0; i < field.length; i++) {
        str += '<div class="col">';
        for (var j = 0; j < field[i].length; j++) {
            var color = field[i][j] ? 'blue' : '#bbbbbb';
            str += '<div class="td" onclick="cellClickHandler(this)" style="background: ' + color + '"  id="' + '[' + i + ',' + j + ']' + '"></div>';
        }
        str += '</div>';
    }
    $('.game_field').empty();
    $('.game_field').append(str);
}

function refreshFieldElement(id, color) {
    document.getElementById('gen').innerHTML = generation;
    var element = document.getElementById(id);
    $(element).attr('style', 'background: ' + color);
}


/**
 * Функция заполнения массива field значениями из строки binStr
 * где binStr строка из 1 и 0 содержащая значение клеток массива
 */
function string2Array(decValue) {
    var remainder = 0;
    for (var i = size - 1; i >= 0; i--) {
        for (var j = size - 1; j >= 0; j--) {
            remainder = decValue % 2;
            decValue = (decValue - remainder) / 2;
            field[i][j] = remainder;
        }
    }


}

function array2String() {
    var bin = '';
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            bin += field[i][j];
        }
    }

    return parseInt(bin, 2);
}

