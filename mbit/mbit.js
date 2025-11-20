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
});
