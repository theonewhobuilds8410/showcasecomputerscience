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
from microbit import *
import random

# Snake setup
snake = [(2, 2)]  # start in middle
dx, dy = 0, 1     # initial direction: down
wait = 500        # milliseconds

# Treasure
apple = (random.randint(0, 4), random.randint(0, 4))

def rotate_left(dx, dy):
    return -dy, dx

def rotate_right(dx, dy):
    return dy, -dx

while True:
    # move snake
    head_x, head_y = snake[0]
    new_head = ((head_x + dx) % 5, (head_y + dy) % 5)
    snake = [new_head] + snake  # prepend new head safely

    # eat apple
    if new_head == apple:
        # grow snake (do nothing, keep tail)
        apple = (random.randint(0, 4), random.randint(0, 4))
    else:
        # remove tail
        snake = snake[:-1]

    # draw
    display.clear()
    for x, y in snake:
        display.set_pixel(x, y, 9)
    display.set_pixel(apple[0], apple[1], 5)

    sleep(wait)

    # buttons
    if button_a.was_pressed():
        dx, dy = rotate_left(dx, dy)
    if button_b.was_pressed():
        dx, dy = rotate_right(dx, dy)
`;

const pongCode = `
// Pong Game
from microbit import *

# ---- Variables ----
bar_x = 0
point = 0
interval = 0
interval_step = 0
ball_x = 0
ball_y = 0
ball_dx = 0
ball_dy = 0
in_game = False

# ---- Functions for buttons ----
def move_left():
    global bar_x
    if bar_x > 0:
        display.set_pixel(bar_x + 1, 4, 0)  # unplot using 0
        bar_x -= 1
        display.set_pixel(bar_x, 4, 9)
        display.set_pixel(bar_x + 1, 4, 9)

def move_right():
    global bar_x
    if bar_x < 3:
        display.set_pixel(bar_x, 4, 0)  # unplot using 0
        bar_x += 1
        display.set_pixel(bar_x, 4, 9)
        display.set_pixel(bar_x + 1, 4, 9)

# ---- Main game loop ----
while True:
    point = 0
    interval = 500
    interval_step = 10
    ball_x = 3
    ball_y = 4
    ball_dx = -1
    ball_dy = -1
    bar_x = 0
    display.scroll("GO!")

    # Draw initial paddle and ball
    display.set_pixel(ball_x, ball_y, 9)
    display.set_pixel(bar_x, 4, 9)
    display.set_pixel(bar_x + 1, 4, 9)

    in_game = True

    while in_game:
        # Handle buttons
        if button_a.was_pressed():
            move_left()
        if button_b.was_pressed():
            move_right()

        # Check horizontal bounds
        if ball_x + ball_dx > 4 or ball_x + ball_dx < 0:
            ball_dx *= -1

        # Check vertical bounds
        if ball_y + ball_dy < 0:
            ball_dy *= -1
        elif ball_y + ball_dy > 3:
            # Check paddle collision
            if (ball_x + ball_dx == bar_x or ball_x + ball_dx == bar_x + 1):
                ball_dy *= -1
                point += 1
                if interval - interval_step >= 0:
                    interval -= interval_step
            else:
                in_game = False

        if in_game:
            # Move ball
            display.set_pixel(ball_x + ball_dx, ball_y + ball_dy, 9)
            display.set_pixel(ball_x, ball_y, 0)  # unplot using 0
            ball_x += ball_dx
            ball_y += ball_dy
            sleep(interval)
        else:
            display.scroll("Score: {}".format(point))
            sleep(1000)
            display.clear()

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


