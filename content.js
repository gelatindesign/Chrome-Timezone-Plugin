// Set listener for requests
chrome.extension.onRequest.addListener( function( request, sender, sendResponse ) {
	switch( request.message ) {
		case 'getSelected':
			// Get selected text
			var text = window.getSelection( ).toString( );
			if ( text.length ) {
				// If text is selected, send back response
				sendResponse({
					data: text,
					error: false
				});
			} else {
				// If no text selected, send an error
				sendResponse({
					error: true,
					errorMessage: "No text selected"
				});
			}
			break;

		default:
			sendResponse({
				error: true,
				errorMessage: "Invalid request"
			});
			break;
	}
});