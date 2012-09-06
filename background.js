var settime = null;

chrome.extension.onRequest.addListener( function( request, sender, sendResponse ) {
	switch( request.message ) {
		case 'setTime':
			window.settext = request.data;
			var popups = chrome.extension.getViews({ type: "popup" });
			console.log(popups);
			console.log(request.data);
			if ( popups.length != 0 ) {
				popups[0].setTime( request.data );
			}
			break;

		default:
			sendResponse({
				data: 'Invalid request'
			});
			break;
	}
});