const types = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.tex'];

$(document).ready(() => {

	$.ajax({
		url: '/user/details',
		type: 'GET',
		success: function(result) {
			$('#inputName').val(result.data.name);
			$('#inputEmail').val(result.data.email);
			$('#inputRegNo').val(result.data.regNo);
			$('#inputMembershipNo').val(result.data.membershipNo);
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
