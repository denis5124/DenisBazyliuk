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
        { locations: ["06", "16", "26"], hits: ["", "", "",] },
        { locations: ["24", "34", "44"], hits: ["", "", "",] },
        { locations: ["10", "11", "12"], hits: ["", "", "",] }
    ],

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

model.fire("53");
model.fire("06");
model.fire("16");
model.fire("26");
model.fire("63");
model.fire("24");
model.fire("34");
model.fire("44");
// приказываем представлению, вывести сообщение о промахе