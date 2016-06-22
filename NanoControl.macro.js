devicePage.onSlider = function(index, val)
{
	isSetPressed ? trackBank.getTrack(index).getVolume().reset() : trackBank.getTrack(index).getVolume().set(val, 128);
};

devicePage.onKnob = function(index, val)
{
	isSetPressed ? primaryDevice.getMacro(index).getAmount().reset() : primaryDevice.getMacro(index).getAmount().set(val, 128);
};

devicePage.sButton = function(index)
{
	trackBank.getTrack(index).getSolo().toggle();
};

devicePage.mButton = function(index)
{
	isSetPressed ? primaryDevice.toggleEnabledState() : trackBank.getTrack(index).getMute().toggle();
};

devicePage.rButton = function(index)
{
	trackBank.getTrack(index).getArm().toggle();
};

devicePage.prevTrackButton = function()
{
	cursorTrack.selectPrevious();
};

devicePage.nextTrackButton = function()
{
	cursorTrack.selectNext();
};

devicePage.prevMarkerButton = function()
{
	primaryDevice.switchToDevice(DeviceType.ANY,ChainLocation.PREVIOUS);
};

devicePage.nextMarkerButton = function()
{
	primaryDevice.switchToDevice(DeviceType.ANY,ChainLocation.NEXT);
};

devicePage.updateIndications = function()
{
	for ( var p = 0; p < 8; p++)
	{
		macro = primaryDevice.getMacro(p).getAmount();
		parameter = primaryDevice.getParameter(p);
		track = trackBank.getTrack(p);
		parameter.setIndication(true);
		macro.setIndication(true);
		track.getVolume().setIndication(false);
		track.getPan().setIndication(false);
		transport.getTempo().setIndication(false);
	}
};