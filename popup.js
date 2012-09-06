document.addEventListener( 'DOMContentLoaded', function( ) {

	// Get current tab
	chrome.tabs.getSelected( null, function( tab ) {

		// Request selected text from current tab
		chrome.tabs.sendRequest( tab.id, {'message': 'getSelected'}, function( response ) {

			var time = response.data;

			// ^(GMT|PST)?(\s*)?([0-9]?[0-9])(\s*)?(:[0-9]{2})?(\s*)?([ap]m)?(\s*)?(GMT|PST)?$
			// 0 = full
			// 1 = abbr
			// 2 = space
			// 3 = hours
			// 4 = space
			// 5 = :minutes
			// 6 = space
			// 7 = am/pm
			// 8 = space
			// 9 = abbr

			var pattern ='^(list_abbr)?(\\s*)?([0-9]?[0-9])(\\s*)?(:[0-9]{2})?(\\s*)?([ap]m)?(\\s*)?(list_abbr)?$';
			var list_abbr = '';

			for ( i=0; i<timezones.length; i++ ) {
				list_abbr += timezones[i][0]+'|';
			}
			pattern = pattern.split( 'list_abbr' ).join( list_abbr );

			// console.log(pattern);

			var regex = new RegExp( pattern, 'i' );

			var matches = regex.exec( time );

			// console.log(matches);

			var abbr1 = matches[1];
			var hours = matches[3];
			var minutes = matches[5];
			var ampm = matches[7];
			var abbr2 = matches[9];

			// Hours to int
			for (i=1; i<10; i++) {
				hours = hours.replace('0'+i.toString(), i.toString());
			}
			hours = parseInt(hours);

			// Minutes to int
			if (minutes && minutes.length > 0) {
				minutes = minutes.replace(':', '');
				for (i=1; i<10; i++) {
					minutes = minutes.replace('0'+i.toString(), i.toString());
				}
				minutes = parseInt(minutes);
			} else {
				minutes = 0;
			}

			// ampm to lower
			if (ampm && ampm.length) {
				ampm = ampm.toLowerCase();
			}

			// Convert to 24 hours
			if (ampm == 'pm' && hours < 12) {
				hours += 12;
			}

			// Get time in a float
			var timenum = hours + (minutes / 60);

			// Get selected timezone
			if (abbr1 && abbr1.length > 0) {
				var abbr = abbr1.toUpperCase();
			} else if (abbr2 && abbr2.length > 0) {
				var abbr = abbr2.toUpperCase();
			}

			// console.log(timenum+' '+abbr);

			// Convert to UTC
			var timenum_utc = false;
			var timezone = false;
			for ( i=0; i<timezones.length; i++ ) {
				if (timezones[i][0] == abbr) { 
					timezone = timezones[i];
					timenum_utc = timenum - timezones[i][2];
					hours_utc = parseInt(timenum_utc);
					minutes_utc = Math.round((timenum_utc - hours_utc) * 60);
					break;
				}
			}

			if (timezone !== false) {
				// console.log(timenum_utc+' UTC');

				document.querySelector('#selected-time').innerHTML = padLeft(hours, 2, '0')+':'+padLeft(Math.round(minutes), 2, '0')+' '+timezone[0];
				document.querySelector('#selected-timezone').innerHTML = timezone[1];

				document.querySelector('#utc-time').innerHTML = padLeft(hours_utc, 2, '0')+':'+padLeft(minutes_utc, 2, '0')+' UTC';
				document.querySelector('#utc-timezone').innerHTML = 'Universal Time Coordinated';

				var groups = document.getElementById('time-groups');
				var selectbox = document.querySelector('#settings select');

				for ( i=0; i<timezones.length; i++ ) {
					var timenum_t = timenum + timezones[i][2] - timezone[2];
					var hours_t = parseInt(timenum_t);
					var minutes_t = Math.round((timenum_t - hours_t) * 60);

					var t  = '<div class="time-group local '+timezones[i][0]+'"';

					if (timezones[i][0] != localStorage.local_timezone) {
						t += ' style="display: none;"';
					}

						t += '>';
						t += '<h2 class="time">'+padLeft(hours_t, 2, '0')+':'+padLeft(minutes_t, 2, '0')+' '+timezones[i][0]+'</h2>';
						t += '<p class="timezone">'+timezones[i][1]+'</p>';
						t += '</div>';

					groups.innerHTML += t;

					selectbox.innerHTML += '<option value="'+timezones[i][0]+'">'+timezones[i][0]+' - '+timezones[i][1]+'</option>';
				}
			}
		});
	});

	if (!localStorage.local_timezone || localStorage.local_timezone == '') {
		localStorage.local_timezone = 'GMT';
	}
	
	var selectbox = document.querySelector('#settings select');
	selectbox.addEventListener('change', function(event) {

		var local_timezones = document.querySelectorAll('.local');
		for (var i=0; i<local_timezones.length; i++) {
			local_timezones[i].style.display = 'none';
		}

		for (var i=0; i<event.target.length; i++) {
			if (event.target[i].selected) {
				var timegroup = document.querySelector('#time-groups .'+event.target[i].value);
				timegroup.style.display = 'block';
				localStorage.local_timezone = event.target[i].value;
				break;
			}
		}

	});

	var options = selectbox.getElementsByTagName('option');
	for (var i=0; i<options.length; i++) {
		options.selected = (options.value == localStorage.local_timezone) ? true : false;
	}
	selectbox.value = localStorage.local_timezone;

});

function padLeft( string, width, pad_str ) {
	width -= string.toString().length;
	if ( width > 0 ) {
		return new Array( width + (/\./.test( string ) ? 2 : 1) ).join( pad_str ) + string;
	}
	return string + ""; // always return a string
}