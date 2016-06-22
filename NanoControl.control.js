/*
Contact : beejeridou@gmail.com
*/

loadAPI(1);

host.defineController("DjbDjb", "NanoKONTROL 2", "1.0", "0271d630-36ee-11e6-bdf4-0800200c9a66");
host.defineMidiPorts(1,1);
var ECHO_ID = "11";
host.defineSysexDiscovery("F0 42 50 00" + ECHO_ID + "F7", "F0 42 50 01 ?? " + ECHO_ID + " 13 01 00 00 ?? ?? ?? ?? F7");
host.addDeviceNameBasedDiscoveryPair(["nanoKONTROL2"], ["nanoKONTROL2"]);

load("NanoControl.functions.js");


var SYSEX_HEADER = "F0 42 40 00 01 13 00";

var CC =
{
	CYCLE : 0x2E,
	REW : 0x2B,
	FF : 0x2C,
	STOP : 0x2A,
	PLAY : 0x29,
	REC : 0x2D,
	PREV_TRACK : 0x3A,
	NEXT_TRACK : 0x3B,
	SET : 0x3C,
	PREV_MARKER : 0x3D,
	NEXT_MARKER : 0x3E,
	SLIDER1 : 0x00,
	SLIDER8 : 0x07,
	KNOB1 : 0x10,
	KNOB8 : 0x17,
	S1 : 32,
	S8 : 0x27,
	M1 : 48,
	M8 : 0x37,
	R1 : 64,
	R8 : 0x47
};

var isSetPressed = false;
var isPlay = false;
var isRecording = false;
var isLooping = false;
var isEngineOn = false;
var isStopPressed = false;
var isPlayPressed = false;
var isRecPressed = false;
 
var mixerPage = new Page();
var devicePage = new Page();
var activePage = mixerPage;

load("NanoControl.mixer.js");
load("NanoControl.macro.js");

