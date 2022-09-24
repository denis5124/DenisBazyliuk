    // объект представления
const view = {
        // включает три метода
    displayMessage: function (msg) {
            // получаем элемент с помощью ID
        const messageArea = document.getElementById("messageArea");
            // задаём текст при помощи свойства
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        const cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        const cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },
};

    // объект модели
const model = {
        // свойства модели
    boardSize: 7, // размер игрового поля
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0, // кол-во потопленных
    ships: [
        { locations: ["0", "0", "0"], hits: ["", "", "",] },
        { locations: ["0", "0", "0"], hits: ["", "", "",] },
        { locations: ["0", "0", "0"], hits: ["", "", "",] }
        ], 

    generateShipLocations: function () { // метод создаёт корабли, пока массив model.ships не будет заполнен
        let locations;
        for (let i = 0; i < this.numShips; i++) { // для каждого корабля генерируем набор позиций
            do { // цикл do while
                locations = this.generateShip(); // генерируется новый набор позиций
            } while (this.collision(locations)); // проверяется, нет ли перекрытий. Если есть перекрытия - ещё одна попытка
            this.ships[i].locations = locations; // полученные позиции без перекрытия сохраняются в свойстве model.ships.locations
        }
    },

    generateShip: function () { // метод создаёт массив со случайными позициями кораблей, не проверяя возможные перекрытия
        let direction = Math.floor(Math.random() * 2); // генерируется число от 0 до 1 и умножается на 2; затем преобразуется в 0 или 1
        let row, col;
        if (direction === 1) { // создаётся горизонтальный корабль
            row = Math.floor(Math.random() * this.boardSize); // задаётся любая строка
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength)); // задаётся строка с учётом длины корабля
        } else { // создаётся вертикальный корабль
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = []; // набор позиций нового корабля начинается с пустого массива
        for (let i = 0; i < this.shipLength; i++) { // в цикле до количества позиций в корабле
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i)); // новая позиция заносится в массив newShipLocations:
                    // где данные состоят из строки и столбца + i. При первой итерации i=0 и сумма означает начальный столбец
            } else {
                newShipLocations.push((row + i) + "" + col); // то же для вертикального
            }
        }
        return newShipLocations; // заполнив массив позициями нового корабля, возвращаем массив методу generateShipLocations
    },

    // locations - массив позиций нового корабля, который надо разместить на игровом поле
    collision: function (locations) { // проверка на отсутствие перекрытий
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i]; // для каждого корабля уже находящегося на поле
            for (var j = 0; j < locations.length; j++) { // проверяем встречаются ли какая-либо из позиций массива locations нового корабля
                                                        // в массиве locations существующих кораблей
                if (ship.locations.indexOf(locations[j]) >= 0) { // indexOf проверяет присутствует ли заданная позиция в массиве
                    return true; // возврат из цикла, функция немедленно завершается и возврщает true
                }
            }
        }
        return false; // если выполнение дошло до этой точки, значит, ни одна из позиций не была обнаружена в других массивах. Ф-ия возвращает прекрытия отсутствуют
    },

    fire: function (guess) { // метод получает координаты выстрела

        for (let i = 0; i < this.numShips; i++) { // перебирается массив ships, последовательно проверяя каждый корабль
            let ship = this.ships[i]; // для каждого корабля
            // получаем массив клеток, занимаемых кораблём
            let index = ship.locations.indexOf(guess); // метод indexOf ищет в массиве указанное значение и возвращает его индекс (или -1, если его значение не найдено)
            if (index >= 0) { // есть попадание
                ship.hits[index] = "hit";
                view.displayHit(guess); // оповещаем предствление о том, что в клетке guess следует вывести маркер попадания
                view.displayMessage("HIT!"); // приказываем предствлению вывести сообщение HIT
                    // проверка не потоплен ли корабль
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship"); // сообщаем игроку, что он потопил корабль
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess); // сообщаем представлению, что в клетке следует вывести маркер промаха
        view.displayMessage("You missed."); // приказываем представлению, вывести сообщение о промахе
        return false;
    },

    isSunk: function (ship) { // метод проверяет потоплен ли корабль
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
}

// объект контроллер
const controller = {
    guesses: 0, // объявляется свойство "попытки", которое инициализируется нулем

    processGuess: function (guess) { // обработка координат выстрела и передача их модели
        let location = parseGuess(guess); // если не получен null значит координаты введены верно
        if (location) {
            this.guesses++; // увеличение счётчика числа выстрелов на 1
            let hit = model.fire(location); // при попадании переменная hit получает true от метода fire
                // если попадание и при этом кол-во потопленных равно кол-ву учавствовавших - сообщение
            if (hit && model.shipsSunk === model.numShips) { 
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
}

function parseGuess(guess) { // функция получения координат
    const alphabet = ["A", "B", "C", "D", "E", "F", "G"]; // массив с буквами, которые могут присутствовать в координатах

    if (guess === null || guess.length !== 2) { // проверка на null и что в строке 2 символа
        alert("Oops, please enter a letter and a number on the board.");
    }
    else {
        firstChar = guess.charAt(0); // извлекает первый символ строки
        let row = alphabet.indexOf(firstChar); // получаем цифру от 0 до 6, соотвествующую букве
        let column = guess.charAt(1); // добавляется код для получения второго символа, представлящего столбец игрового поля
        if (isNaN(row) || isNaN(column)) { // проверка явлются ли цифрами строки и столбцы
            alert("Oops, that isn't on the board.");
        }
        // проверка влазят ли полученные цифры в диапазон игрового поля (см. объект модели)
        else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        }
        else {
            return row + column;
        }
    }
    return null; // проверки не пройдены, возвращается null
}

function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value; // извлечение введённых координат
    controller.processGuess(guess); // передача введённых координат контроллеру
    guessInput.value = ""; // команда удаляет содержимое input формы
}

function handleKeyPress(e) { // обработчик нажатий клавиш; // (e)-какая клавиша была нажата
    const fireButton = document.getElementById("fireButton"); // получение ссылки на кнопку Fire
    if (e.keyCode === 13) { // нажатие Enter = 13
        fireButton.onclick(); // вызывается функция и кнопка Fire! работает как-будто по ней нажали
        return false;
    }
}

window.onload = init; // передача введённых координат контроллеру

function init() {
    let fireButton = document.getElementById("fireButton"); // получение ссылки на кнопку Fire
    fireButton.onclick = handleFireButton; // назначается обработчик события - функция handleFireButton
    let guessInput = document.getElementById("guessInput"); // получение ссылки на поле ввода координат
    guessInput.onkeydown = handleKeyPress; // назначается обработчик события - функция handleKeyPress
    model.generateShipLocations(); // вызов метода, генерирующего позиции кораблей, кот. заполнит пустые массивы в объекте модели
            // вызывается из функции init, чобы это проиходило во время загрузки игры (до её начала).
            // Позиции всех кораблей будут определены к моменту начала
}
