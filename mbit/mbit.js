let device;

const connectBtn = document.getElementById('connectBtn');
const sendBtn = document.getElementById('sendBtn');
const status = document.getElementById('status');

sendBtn.disabled = true;

connectBtn.addEventListener('click', async () => {
  try {
    // Directly in click handler — works with file://
    device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x0d28 }] });
    await device.open();
    if (device.configuration === null) {
      await device.selectConfiguration(1);
    }
    await device.claimInterface(0); // original interface from old working code

    status.textContent = 'Micro:Bit connected!';
    sendBtn.disabled = false;
  } catch (err) {
    status.textContent = 'Failed to connect: ' + err;
  }
});

sendBtn.addEventListener('click', async () => {
  const text = document.getElementById('mbitText').value;
  if (!device) {
    status.textContent = 'Connect a Micro:Bit first.';
    return;
  }
  if (!text) {
    status.textContent = 'Type some text first.';
    return;
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Send using the same endpoint/interface as old working code
    await device.transferOut(1, data);

    status.textContent = `Sent "${text}" to Micro:Bit!`;
  } catch (err) {
    status.textContent = 'Error sending data: ' + err;
  }
});
