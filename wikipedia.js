// http://en.wikipedia.org/wiki/List_of_time_zone_abbreviations

var json = "var timezones = [\n";
$('.wikitable tbody tr').each(function() {
	var tr = $(this);
	var abbr = tr.children('td:nth-child(1)').text();
	var time = tr.children('td:nth-child(3)').text();
	var label = tr.children('td:nth-child(2)').text() + ' ('+time+')';
	
	label = label.replace('−', '-');

	time = time.replace('UTC', '');
	time = time.replace('+', '');
	time = time.replace('−', '-');
	time = time.replace(':15', '.25');
	time = time.replace(':30', '.5');
	time = time.replace(':45', '.75');

	for (i=1; i<10; i++) {
		time = time.replace('0'+i.toString(), i.toString());
	}

	json += "\t"+'["'+abbr+'",';
	json += '"'+label+'",';
	json += time+'],'+"\n";
});
json += "];";
console.log(json);