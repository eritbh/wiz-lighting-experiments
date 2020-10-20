# wiz-lighting-experiments

Playground where I experiment with sending commands over WiFi to my Philips Hue A19 lightbulb with Wiz control.

## Resources

- http://blog.dammitly.net/2019/10/cheap-hackable-wifi-light-bulbs-or-iot.html

## Findings

You can send commands to the bulb by sending JSON packets to the bulb on UDP 38899. It'll respond after every request, as far as I can tell. No auth is required.

    {
        "id": 1,
        "method": "setPilot",
        "params": {
            "r": 255,
            "g": 255,
            "b": 255,
            "w": 255,
            "c": 255
        }
    }

- `id` accepts any number value. This value is echoed in the response so you can tell when specific requests are responded to, and it's otherwise unused.
- `method` can be set to various things. I've only tried out `setPilot` but I know there are plenty more for controlling aspects of the bulb other than the color.
- `params` contains more details about the request. For `setPilot`, it contains info about what color you're setting the bulb to. `r`, `g`, and `b`` are usual RGB LED values, and `w` and `c` are values for the warm white and cool white LEDs. Values are 0-255 inclusive. I'm pretty sure there's another alternate param you can send here instead of component values to use a preset stored on the bulb.

I disassembled the bulb. It's made up of two boards. The one with the LEDs on it has an LED array driver IC labeled SM15133EK. I found a datasheet that seems to correspond to it [here](https://pdf1.alldatasheet.com/datasheet-pdf/view/1133954/LINKAGE/SM1533E/+01_4-JJXIHxlDIpeZTYEDEP+/datasheet.pdf), though it's in Chinese.

The connector block on the LED board has the following connections:

&nbsp;|&nbsp;|&nbsp;|&nbsp;
-|-|-|-
?|RGB LED array common anode|Driver pin 1 (VCC)|Driver bottom pad (Ground)
?|510 ohm resistor to driver pin 2 (DIM3)|510 ohm resistor to driver pin 3 (DIM2)|510 ohm resistor to driver pin 4 (DIM1)

Not sure yet what the other large connectors on either side are for, probably controlling the warm/cool white LEDs.
