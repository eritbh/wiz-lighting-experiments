const dgram = require('dgram');
const socket = dgram.createSocket('udp4', /*message => console.log(message.toString('utf8'))*/);

/** The IP of the bulb we're controlling */
const BULB_IP = process.argv[2];
/** The port the bulb listens on (38899 seems standard for Wiz stuff) */
const BULB_PORT = 38899;

/** Returns a promise that resolves after the given number of milliseconds. */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Sets the color of the LED. */
const setPilot = opts => socket.send(`{"id":${Math.floor(Math.random() * 10)},"method":"setPilot","params":${JSON.stringify(opts)}}`, BULB_PORT, BULB_IP);

// LED values
let red = 255;
let green = 0;
let blue = 0;
let warm = 10;
let cool = 10;

// Cycle through colors slowly (takes ~1.5s to cycle once)
(async () => {
	while (true) {
		if (red >= 255 && green < 255 && blue == 0) {
			green += 1;
		} else if (green >= 255 && red > 0) {
			red -= 1;
		} else if (green >= 255 && blue < 255) {
			blue += 1;
		} else if (blue >= 255 && green > 0) {
			green -= 1;
		} else if (blue >= 255 && red < 255) {
			red += 1;
		} else {
			blue -= 1;
		}

		await sleep(1);
	}
})();

// Update the color on the bulb every so often without overwhelming it
(async () => {
	while (true) {
		setPilot({
			r: red,
			g: green,
			b: blue,
			w: warm,
			c: cool,
		});

		await sleep(50);
	}
})();

console.log(`Streaming some fancy colors to ${BULB_IP}:${BULB_PORT}`)
