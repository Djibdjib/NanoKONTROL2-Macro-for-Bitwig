function init()
{
	host.showPopupNotification("Welcome to NanoKontrol 2 by DjbDjb");

	host.getMidiInPort(0).setMidiCallback(onMidi);

	transport = host.createTransport();
	application = host.createApplication();
	trackBank = host.createTrackBank(8, 1, 0);
	cursorTrack = host.createCursorTrack(2, 0);
	primaryDevice = cursorTrack.getPrimaryDevice();

	activePage.updateIndications();
	
	transport.addIsPlayingObserver(function(on)
	{
		isPlay = on;
	});
	transport.addIsRecordingObserver(function(on)
	{
      isRecording = on;
	});
	transport.addIsLoopActiveObserver(function(on)
	{
      isLooping = on;
	});
}

function Page()
{
}

Page.prototype.prepareCommonOutput = function()
{
   setOutput(CC.PLAY, isPlay ? 127 : 0);
   setOutput(CC.STOP, !isPlay ? 127 : 0);
   setOutput(CC.REC, isRecording ? 127 : 0);
   setOutput(CC.CYCLE, activePage == mixerPage ? 127 : 0);
};

function onMidi(status, data1, data2)
{
	var cc = data1;
	var val = data2;
	// printMidi(status, cc, val);

	if (status == 0xBF)
	{
		switch (cc)
		{
			case CC.SET:
				isSetPressed = val > 0;
				break;
			case CC.STOP:
				isStopPressed = val > 0;
				break;
			case CC.PLAY:
				isPlayPressed = val > 0;
				break;
			case CC.REC:
				isRecPressed = val > 0;
				break;
		}
		if (isStopPressed && isPlayPressed && isRecPressed)
			toggleEngineState();

		var index = data1 & 0xf;

		if (withinRange(cc, CC.SLIDER1, CC.SLIDER8))
			activePage.onSlider(index, val);
		
		else if (withinRange(cc, CC.KNOB1, CC.KNOB8))
			activePage.onKnob(index, val);

		if (val > 0) // ignore when buttons are released
		{
			if (withinRange(cc, CC.M1, CC.M8))
				isSetPressed ? 	runDevicesPage(index) : activePage.mButton(index);

			else if (withinRange(cc, CC.S1, CC.S8))
				activePage.sButton(index);

			else if (withinRange(cc, CC.R1, CC.R8))
				activePage.rButton(index);

			switch (cc)
			{
				case CC.PLAY:
					if (isEngineOn)
					{
						if (!isStopPressed && !isRecPressed) isSetPressed ? transport.returnToArrangement() : isPlay ? transport.restart() : transport.play();
					}
					else transport.restart();
					break;

				case CC.STOP:
					if (!isPlayPressed && !isRecPressed) isSetPressed ? transport.resetAutomationOverrides() : transport.stop();
					break;

				case CC.REC:
					if (!isPlayPressed && !isStopPressed) isSetPressed ? cursorTrack.getArm().toggle() : transport.record();
					break;

				case CC.CYCLE:
					isSetPressed ? transport.toggleLoop() : switchPage();
					break;

				case CC.REW:
					transport.rewind();
					break;

				case CC.FF:
					isSetPressed ? arranger.togglePlaybackFollow() : transport.fastForward();
					break;

				case CC.PREV_TRACK:
					activePage.prevTrackButton();
					break;

				case CC.NEXT_TRACK:
					activePage.nextTrackButton();
					break;

				case CC.PREV_MARKER:
					activePage.prevMarkerButton();
					break;

				case CC.NEXT_MARKER:
					activePage.nextMarkerButton();
					break;
			}
		}
	}
}

function switchPage()
{
	switch(activePage)
	{
		case mixerPage:
			activePage = devicePage;
    		host.showPopupNotification("Macro Mode");
		break;

		case devicePage:
			activePage = mixerPage;
    		host.showPopupNotification("Mixer Mode");
		break;
	}
	activePage.updateIndications();
}

function runDevicesPage(index)
{
	if(activePage != devicePage)
	{
		activePage = devicePage;
    	host.showPopupNotification("Macro Mode");
		activePage.updateIndications();
	}
	trackBank.getTrack(index).select();
}

function toggleEngineState()
{
	isEngineOn ? application.deactivateEngine() : application.activateEngine();
}

function allIndicationsOff()
{
	for ( var p = 0; p < 8; p++)
	{
      primaryDevice.getParameter(p).setIndication(false);
      primaryDevice.getMacro(p).getAmount().setIndication(false);
		trackBank.getTrack(p).getVolume().setIndication(false);
		trackBank.getTrack(p).getPan().setIndication(false);
	}
}

function exit()
{
	allIndicationsOff();
	sendSysex(SYSEX_HEADER + "00 00 00 F7"); // Leave native mode
}