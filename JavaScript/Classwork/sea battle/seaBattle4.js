// объект представления
const view1 = {
    // включает три метода
    displayMessage: function (msg) {
        // получаем элемент с помощью ID
        const messageArea = document.getElementById("messageArea1");
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

const view2 = {
    // включает три метода
    displayMessage: function (msg) {
        // получаем элемент с помощью ID
        const messageArea = document.getElementById("messageArea2");
        // задаём текст при помощи свойства
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        const cell = document.getElementById(2+location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        const cell = document.getElementById(2+location);
        cell.setAttribute("class", "miss");
    },
};

// объект модели
const model1 = {
    // свойства модели
    boardSize: 10, // размер игрового поля
    numShips: 10,
    shipsSunk: 0, // кол-во потопленных
    ships: [
        { locations: ["0", "0", "0", "0",], hits: ["", "", "", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
    ],

    generateShipLocations4: function () { // метод создаёт корабли, пока массив model.ships не будет заполнен
        let locations;
        for (let i = 0; i < 1; i++) { // для каждого корабля генерируем набор позиций
            do { // цикл do while
                locations = this.generateShip(4); // генерируется новый набор позиций
            } while (this.collision(locations)); // проверяется, нет ли перекрытий. Если есть перекрытия - ещё одна попытка
            this.ships[i].locations = locations; // полученные позиции без перекрытия сохраняются в свойстве model.ships.locations
        }
    },

    generateShipLocations3: function () { // метод создаёт корабли, пока массив model.ships не будет заполнен
        let locations;
        for (let i = 1; i < 3; i++) { // для каждого корабля генерируем набор позиций
            do { // цикл do while
                locations = this.generateShip(3); // генерируется новый набор позиций
            } while (this.collision(locations)); // проверяется, нет ли перекрытий. Если есть перекрытия - ещё одна попытка
            this.ships[i].locations = locations; // полученные позиции без перекрытия сохраняются в свойстве model.ships.locations
        }
    },

    generateShipLocations2: function () { // метод создаёт корабли, пока массив model.ships не будет заполнен
        let locations;
        for (let i = 3; i < 6; i++) { // для каждого корабля генерируем набор позиций
            do { // цикл do while
                locations = this.generateShip(2); // генерируется новый набор позиций
            } while (this.collision(locations)); // проверяется, нет ли перекрытий. Если есть перекрытия - ещё одна попытка
            this.ships[i].locations = locations; // полученные позиции без перекрытия сохраняются в свойстве model.ships.locations
        }
    },

    generateShipLocations1: function () { // метод создаёт корабли, пока массив model.ships не будет заполнен
        let locations;
        for (let i = 6; i < 10; i++) { // для каждого корабля генерируем набор позиций
            do { // цикл do while
                locations = this.generateShip(1); // генерируется новый набор позиций
            } while (this.collision(locations)); // проверяется, нет ли перекрытий. Если есть перекрытия - ещё одна попытка
            this.ships[i].locations = locations; // полученные позиции без перекрытия сохраняются в свойстве model.ships.locations
        }
    },

    generateShip: function (length) { // метод создаёт массив со случайными позициями кораблей, не проверяя возможные перекрытия
        this.shipLength = length;
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
            let ship = model1.ships[i]; // для каждого корабля уже находящегося на поле
            for (let j = 0; j < locations.length; j++) { // проверяем встречаются ли какая-либо из позиций массива locations нового корабля
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
                view1.displayHit(guess); // оповещаем предствление о том, что в клетке guess следует вывести маркер попадания
                view1.displayMessage("HIT!"); // приказываем предствлению вывести сообщение HIT
                // проверка не потоплен ли корабль
                if (this.isSunk(ship)) {
                    view1.displayMessage("You sank my battleship"); // сообщаем игроку, что он потопил корабль
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view1.displayMiss(guess); // сообщаем представлению, что в клетке следует вывести маркер промаха
        view1.displayMessage("You missed."); // приказываем представлению, вывести сообщение о промахе
        return false;
    },

    isSunk: function (ship) { // метод проверяет потоплен ли корабль
        for (let i = 0; i < ship.locations.length; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
}

const model2 = {
    // свойства модели
    boardSize: 10, // размер игрового поля
    numShips: 10,
    shipsSunk: 0, // кол-во потопленных
    ships: [
        { locations: ["0"], hits: [""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
        { locations: ["0"], hits: ["", ""] },
    ],

    generateShipLocations4: function () { // метод создаёт корабли, пока массив model.ships не будет заполнен
        let locations;
        for (let i = 0; i < 1; i++) { // для каждого корабля генерируем набор позиций
            do { // цикл do while
                locations = this.generateShip(4); // генерируется новый набор позиций
            } while (this.collision(locations)); // проверяется, нет ли перекрытий. Если есть перекрытия - ещё одна попытка
            this.ships[i].locations = locations; // полученные позиции без перекрытия сохраняются в свойстве model.ships.locations
        }
    },

    generateShipLocations3: function () { // метод создаёт корабли, пока массив model.ships не будет заполнен
        let locations;
        for (let i = 1; i < 3; i++) { // для каждого корабля генерируем набор позиций
            do { // цикл do while
                locations = this.generateShip(3); // генерируется новый набор позиций
            } while (this.collision(locations)); // проверяется, нет ли перекрытий. Если есть перекрытия - ещё одна попытка
            this.ships[i].locations = locations; // полученные позиции без перекрытия сохраняются в свойстве model.ships.locations
        }
    },

    generateShipLocations2: function () { // метод создаёт корабли, пока массив model.ships не будет заполнен
        let locations;
        for (let i = 3; i < 6; i++) { // для каждого корабля генерируем набор позиций
            do { // цикл do while
                locations = this.generateShip(2); // генерируется новый набор позиций
            } while (this.collision(locations)); // проверяется, нет ли перекрытий. Если есть перекрытия - ещё одна попытка
            this.ships[i].locations = locations; // полученные позиции без перекрытия сохраняются в свойстве model.ships.locations
        }
    },

    generateShipLocations1: function () { // метод создаёт корабли, пока массив model.ships не будет заполнен
        let locations;
        for (let i = 6; i < 10; i++) { // для каждого корабля генерируем набор позиций
            do { // цикл do while
                locations = this.generateShip(1); // генерируется новый набор позиций
            } while (this.collision(locations)); // проверяется, нет ли перекрытий. Если есть перекрытия - ещё одна попытка
            this.ships[i].locations = locations; // полученные позиции без перекрытия сохраняются в свойстве model.ships.locations
        }
    },

    generateShip: function (length) { // метод создаёт массив со случайными позициями кораблей, не проверяя возможные перекрытия
        this.shipLength = length;
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
        let locationsBorder = [];
        for (let l = 0; l < locations.length; l++) {
            locationsBorder.push(
                Number(locations[l].charAt(0)) + '' + Number(locations[l].charAt(1)),
                (Number(locations[l].charAt(0)) + 1) + '' + Number(locations[l].charAt(1)),
                (Number(locations[l].charAt(0)) + 1) + '' + (Number(locations[l].charAt(1)) + 1),
                (Number(locations[l].charAt(0)) + 1) + '' + (Number(locations[l].charAt(1)) - 1),
                (Number(locations[l].charAt(0)) - 1) + '' + Number(locations[l].charAt(1)),
                (Number(locations[l].charAt(0)) - 1) + '' + (Number(locations[l].charAt(1)) + 1),
                (Number(locations[l].charAt(0)) - 1) + '' + (Number(locations[l].charAt(1)) - 1),
                Number(locations[l].charAt(0)) + '' + (Number(locations[l].charAt(1)) + 1),
                Number(locations[l].charAt(0)) + '' + (Number(locations[l].charAt(1)) - 1)
            )
        }
        for (let i = 0; i < this.numShips; i++) {
            let ship = model2.ships[i]; // для каждого корабля уже находящегося на поле
            for (let j = 0; j < locationsBorder.length; j++) { // проверяем встречаются ли какая-либо из позиций массива locations нового корабля
                // в массиве locations существующих кораблей
                if (ship.locations.indexOf(locationsBorder[j]) >= 0) { // indexOf проверяет присутствует ли заданная позиция в массиве
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
                view2.displayHit(guess); // оповещаем предствление о том, что в клетке guess следует вывести маркер попадания
                view2.displayMessage("HIT!"); // приказываем предствлению вывести сообщение HIT
                // проверка не потоплен ли корабль
                if (this.isSunk(ship)) {
                    view2.displayMessage("You sank my battleship"); // сообщаем игроку, что он потопил корабль
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view2.displayMiss(guess); // сообщаем представлению, что в клетке следует вывести маркер промаха
        view2.displayMessage("You missed."); // приказываем представлению, вывести сообщение о промахе
        return false;
    },

    isSunk: function (ship) { // метод проверяет потоплен ли корабль
        for (let i = 0; i < ship.locations.length; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
}

// объект контроллер
const controller1 = {
    guesses: 0, // объявляется свойство "попытки", которое инициализируется нулем

    processGuess1: function (guess) { // обработка координат выстрела и передача их модели
        let location = guess;
        if (location) {
            this.guesses++; // увеличение счётчика числа выстрелов на 1
            let hit = model1.fire(location); // при попадании переменная hit получает true от метода fire
            // если попадание и при этом кол-во потопленных равно кол-ву учавствовавших - сообщение
            if (hit && model1.shipsSunk === model1.numShips) {
                view1.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
}

const controller2 = {
    guesses: 0, // объявляется свойство "попытки", которое инициализируется нулем

    processGuess2: function (guess) { // обработка координат выстрела и передача их модели
        let location = parseGuess2(guess); // если не получен null значит координаты введены верно
        if (location) {
            this.guesses++; // увеличение счётчика числа выстрелов на 1
            let hit = model2.fire(location); // при попадании переменная hit получает true от метода fire
            // если попадание и при этом кол-во потопленных равно кол-ву учавствовавших - сообщение
            if (hit && model2.shipsSunk === model2.numShips) {
                view2.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
}

function parseGuess2(guess) { // функция получения координат
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; // массив с буквами, которые могут присутствовать в координатах

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
        else if (row < 0 || row >= model2.boardSize || column < 0 || column >= model2.boardSize) {
            alert("Oops, that's off the board!");
        }
        else {
            return row + column;
        }
    }
    return null; // проверки не пройдены, возвращается null
}

let guessArr = [];
function handleFireButton1() {
    let row = String(Math.floor(Math.random() * model1.boardSize));
    let column = String(Math.floor(Math.random() * model1.boardSize));
    let guess = row + column; // извлечение введённых координат
        if (guessArr.indexOf(guess) >=1) {
            handleFireButton1();
        } else {
            guessArr.push(guess),
            controller1.processGuess1(guess); // передача введённых координат
        }
}

function handleFireButton2() {
    const guessInput2 = document.getElementById("guessInput2");
    let guess = guessInput2.value; // извлечение введённых координат
    controller2.processGuess2(guess); // передача введённых координат контроллеру
    guessInput2.value = ""; // команда удаляет содержимое input формы
}

function handleKeyPress2(e) { // обработчик нажатий клавиш; // (e)-какая клавиша была нажата
    const fireButton2 = document.getElementById("fireButton2"); // получение ссылки на кнопку Fire
    if (e.keyCode === 13) { // нажатие Enter = 13
        fireButton2.onclick(); // вызывается функция и кнопка Fire! работает как-будто по ней нажали
        return false;
    }
}

window.onload = init; // передача введённых координат контроллеру

function init() {
    let fireButton1 = document.getElementById("fireButton1"); // получение ссылки на кнопку Fire
    fireButton1.onclick = handleFireButton1; // назначается обработчик события - функция handleFireButton
    let fireButton2 = document.getElementById("fireButton2"); // получение ссылки на кнопку Fire
    fireButton2.onclick = handleFireButton2; // назначается обработчик события - функция handleFireButton
    let guessInput2 = document.getElementById("guessInput2"); // получение ссылки на поле ввода координат
    guessInput2.onkeydown = handleKeyPress2; // назначается обработчик события - функция handleKeyPress
    model1.generateShipLocations4(); // вызов метода, генерирующего позиции кораблей, кот. заполнит пустые массивы в объекте модели
    // вызывается из функции init, чобы это проиходило во время загрузки игры (до её начала).
    // Позиции всех кораблей будут определены к моменту начала
    model1.generateShipLocations3();
    model1.generateShipLocations2();
    model1.generateShipLocations1();
    model2.generateShipLocations4();
    model2.generateShipLocations3();
    model2.generateShipLocations2();
    model2.generateShipLocations1();
}
