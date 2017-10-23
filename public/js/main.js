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
		$('#uploaded-file').text(this.files[0].name);
	});

});
