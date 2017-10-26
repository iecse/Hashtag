$(document).ready(() => {

	$.ajax({
		url: '/admin/users',
		type: 'GET',
		success: function(result) {
			users = result;
			result.filter(user => user.submitted).forEach((user) => {
				$('#users').append(makeUserDiv(user.name, user.id, true));
			});
			result.filter(user => !user.submitted).forEach((user) => {
				$('#users').append(makeUserDiv(user.name, user.id, false));
			});
		}
	});

	$('.close-modal').click(e => {
		$('#user-modal-background').css('display', 'none');
	});

	$(window).click(e => {
		if(e.target == document.getElementById('user-modal-background'))
			$('#user-modal-background').css('display', 'none');
	});

});

var users = [];

function view(id) {
	var user = users.filter(user => user.id == id)[0];
	$('#user-modal-background').css('display', 'flex');
	$('#modal-name').text(user.name);
	$('#modal-email').text(user.email);
	$('#modal-membership-number').text(user.membershipNo);
	$('#modal-registration-number').text(user.regNo);
	$('#modal-name-const').text(user.nameConst);
}

function makeUserDiv(name, id, submitted) {

	if(submitted)
		var submittedClass = 'submitted'

	let div = `
	<div class="user ${submittedClass}">
		<div class="name">${name}</div>
		<div class="download">
			<a href="/admin/submissions/${name}/${id}" download="Hashtag Submission">
				Download Submission
			</a>
		</div>
		<button class="view" onclick="view('${id}')">View</button>
	</div>
	`
	return div;
}