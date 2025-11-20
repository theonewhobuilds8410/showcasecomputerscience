let port;
let writer;

const connectBtn = document.getElementById('connectBtn');
const sendBtn = document.getElementById('sendBtn');
const status = document.getElementById('status');

connectBtn.addEventListener('click', async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    writer = port.writable.getWriter();
    status.textContent = 'Micro:Bit connected via Web Serial!';
    sendBtn.disabled = false;
  } catch (err) {
    status.textContent = 'Failed to connect: ' + err;
  }
});

sendBtn.addEventListener('click', async () => {
  const text = document.getElementById('mbitText').value;
  if (!text) {
    status.textContent = 'Type some text first.';
    return;
  }

  try {
    await writer.write(new TextEncoder().encode(text + "\n"));
    status.textContent = `Sent "${text}" to Micro:Bit!`;
  } catch (err) {
    status.textContent = 'Error sending: ' + err;
  }

const snakeCode = `
// Snake Game
function moveForward () {
    basic.pause(wait)
    x1 = arr[0] % 5
    y1 = Math.trunc(arr[0] / 5)
    if (x1 + x_add < 0) {
        x1 = 4
    } else {
        x1 = (x1 + x_add) % 5
    }
    if (y1 + y_add < 0) {
        y1 = 4
    } else {
        y1 = (y1 + y_add) % 5
    }
    arr.insertAt(0, x1 + y1 * 5)
    arr.removeAt(arr.length - 1)
    
}
function generateImage () {
    basic.clearScreen()
    for (let i = 0; i <= arr.length - 1; i++) {
        x = arr[i] % 5
        y = Math.trunc(arr[i] / 5)
        led.plot(x, y)
    }
}
function showTreasure(){
    led.plot(treasure_x,treasure_y)
    x = arr[0]%5
    y = Math.trunc(arr[0]/5)
    if(x==treasure_x&&y==treasure_y){
        arr.push(arr[0])
        treasure_x = randint(0,4)
        treasure_y = randint(0,4)
    }
}
let treasure_x = randint(0,4)
let treasure_y = randint(0,4)
let y = 0
let x = 0
let y1 = 0
let x1 = 0
let arr: number[] = []
let wait = 0
let x_add = 0
let y_add = 1
wait = 500
arr = [0]
basic.forever(function () {
    generateImage()
    moveForward()
})
basic.forever(function(){
    showTreasure()
})
input.onButtonPressed(Button.B,function(){
    if (x_add == 0) {
        x_add = 1
        y_add = 0
    } else if (y_add == 0) {
        x_add = 0
        y_add = 1
    } 
})
input.onButtonPressed(Button.AB,function(){
    arr=[0]
})
input.onButtonPressed(Button.A, function () {
    if (x_add == 0) {
        x_add = -1
        y_add = 0
    } else if ( y_add == 0) {
        x_add = 0
        y_add = -1
    } 
})
`;

const pongCode = `
// Pong Game
let bar_x = 0
let point = 0
let interval = 0
let interval_step = 0
let ball_x = 0
let ball_y = 0
let ball_dx = 0
let ball_dy = 0
let in_game = false
// 往左
input.onButtonPressed(Button.A, function () {
    if (bar_x > 0) {
        led.unplot(bar_x + 1, 4)
        bar_x = bar_x - 1
        led.plot(bar_x, 4)
    }
})
// 往右
input.onButtonPressed(Button.B, function () {
    if (bar_x < 3) {
        led.unplot(bar_x, 4)
        bar_x = bar_x + 1
        led.plot(bar_x + 1, 4)
    }
})
basic.forever(function () {
    point = 0
    interval = 500
    interval_step = 10
    ball_x = 3
    ball_y = 4
    ball_dx = -1
    ball_dy = -1
    bar_x = 0
    basic.showString("GO!")
    led.plot(ball_x, ball_y)
    led.plot(bar_x, 4)
    led.plot(bar_x + 1, 4)
    in_game = true
    while (in_game) {
        if (ball_x + ball_dx > 4) {
            ball_dx = ball_dx * -1
        } else if (ball_x + ball_dx < 0) {
            ball_dx = ball_dx * -1
        }
        if (ball_y + ball_dy < 0) {
            ball_dy = ball_dy * -1
        } else if (ball_y + ball_dy > 3) {
            if (led.point(
            ball_x + ball_dx,
            ball_y + ball_dy
            )) {
                ball_dy = ball_dy * -1
                point = point + 1
                if (interval - interval_step >= 0) {
                    interval = interval - interval_step
                }
            } else {
                in_game = false
            }
        }
        if (in_game) {
            led.plot(
            ball_x + ball_dx,
            ball_y + ball_dy
            )
            led.unplot(ball_x, ball_y)
            ball_x = ball_x + ball_dx
            ball_y = ball_y + ball_dy
            basic.pause(interval)
        } else {
            game.setScore(point)
            game.gameOver()
        }
    }
})

`;

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        document.getElementById("copyStatus").textContent = "Copied!";
        setTimeout(() => {
            document.getElementById("copyStatus").textContent = "";
        }, 1500);
    });
}

document.getElementById("copySnake").addEventListener("click", () => copyToClipboard(snakeCode));
document.getElementById("copyPong").addEventListener("click", () => copyToClipboard(pongCode));

});

