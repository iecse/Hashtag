const types = ['application/pdf', 'text/plain'];

$(document).ready(() => {

	$.ajax({
		url: '/user/details',
		type: 'GET',
		success: function(result) {
			$('#inputName').val(result.name);
			$('#inputEmail').val(result.email);
			$('#inputRegNo').val(result.regNo);
			$('#inputMembershipNo').val(result.membershipNo);
		}
	});

	$('#open-upload').click(() => {
		$('#files').click();
	});

	$('#files').change(function() {
		if(types.indexOf(this.files[0].type) === -1) $('#uploaded-file').text('This file type is not accepted');
		else $('#uploaded-file').text(this.files[0].name);
	});

	$('#submit-button').click(e => {
		e.preventDefault();
		var fields = $('#file-upload').serializeArray();
	        if(validator.isAlpha(fields[0].value.replace(/ /g, '')) && validator.isLength(fields[0].value.toString(), {min: 0, max: 50}) && validator.isEmail(fields[1].value) && validator.isNumeric(fields[2].value.toString()) && validator.isLength(fields[2].value.toString(), {min: 9, max: 9}) && validator.isNumeric(fields[3].value.toString()) && validator.isLength(fields[3].value.toString(), {min: 5, max: 5}))
			$('#file-upload').submit();
		else {
			$('#snackbar').toggleClass('show');
			setTimeout(function() {
				$('#snackbar').toggleClass('show');
			}, 3000);
		}
	});

});
