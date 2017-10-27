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

});
