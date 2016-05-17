var clipboard = new Clipboard('#button');
clipboard.on('success', function (e) {
	console.log(e);
});
clipboard.on('error', function (e) {
	console.log(e);
});

$('.refresh').hide();
var fileCount;
var matrix = [['Wavelength']];
for (var w = 300, i = 1; w < 1000.5; w += 0.5) {
	matrix[i] = [w];
	i++
}

$('#fileList').change(function (e) {
	$('.refresh').show();
	var input = e.target;
	var fileList = input.files;
	fileCount = fileList.length;
	for (var i = 0; i < fileList.length; i++) {
		var fileName = fileList[i].name.split('.')[0]; //trim the extension
		matrix[0].push(fileName); //add the file name to the header line
		processFile(fileList[i]);
	}
});

function processFile(file) {
	var reader = new FileReader();
	reader.onloadend = function () {
		// get file content
		fileCount--;
		var fileContent = reader.result;
		var lines = fileContent.split('\n');
		var dataSet = lines.map(function (line, i, lines) {
			if (i > 1) { //clear the first two lines
				//split the values
				return line.trim().split('  ').map(function (v) {
					return parseFloat(v);
				}); //example: [ 302.5, 3.342]
			}
		});
		/*       dataSet = [
		 [...]
		 [ 302.5, 3.342]
		 [ 303, 4.234]
		 [ 303.5, 23.23]
		 [...]
		 ] */
		var i = 1;
		dataSet.forEach(function (arr) {
			if (arr && arr[0] >= 300 && arr[0] <= 1000) {
				matrix[i].push(arr[1]);
				i++;
			}
		});
		
		if (fileCount == 0) {
			displayData();
			$('.refresh').hide('500');
		}
		
	};
	reader.readAsText(file, "UTF-8");
}


function displayData() {
	var text = '';
	$('#display').val(function () {
		text += matrix[0].join('	');
		text += '\n';
		matrix.forEach(function (lineArr, i, matrix) {
			if (i > 0) {
				text += lineArr.join('	');
				text += '\n';
			}
		});
		return text;
	});
	
}
