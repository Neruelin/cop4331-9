const urlBase = 'https://cop4331-9.herokuapp.com'

var index = 0;
var editing = 0;
var filter = false;
var results;
var filteredResults;

$(document).ready(() => {
	loadContacts();
	show('contact-info-flex', true);
});

function loadContacts () {
	$.get("/contacts", function (res, status) {
		console.log(res);
		show('contact-info-flex', true);
		results = res;
		index = 0;
		removeFilter();
		displayContact();
    })
    .fail(function () {
		displayErr();
	});
}

//   Display new contact fields to user to fill in.
function createContact()
{
    show('addContact', true);
	show('contacts', false);
}

//   Display selected contact.
function displayContact()
{
	var res = results[index];

	$('#Name').text(res.fname + ' ' + res.lname);
	$('#Phone').text(res.phonenumber);
	$('#Email').text(res.email);
	$('#Street').text(res.address);
	$('#CityState').text(res.city + ', ' + res.state);
	$('#ZIP').text(res.zipcode);
	$('#fname').text(res.fname);
	$('#lname').text(res.lname);
	$('#city').text(res.city);
	$('#state').text(res.state);
}

//   Search for contact by Name.
function searchContact()
{
    var url_login = 'https://cop4331-9.herokuapp.com/contacts';
	let search = $('#search').val();
	$("#filter-text").text("Filtered by the term: \"" + search + "\".");
	$("#filter-info").show();
	search = new RegExp(search);
	filteredResults = [];
	for (var key in results) {
		if (search.test(results[key].fname + " " + results[key].lname)) {
			filteredResults.push(key);
		}
	}
	filter = true;
	index = filteredResults[0];
	displayContact();
}

function removeFilter () {
	filter = false;
	index = 0;
	$("#filter-info").hide();
	displayContact();
}

function nextContact(){
	if (filter == true) {
		index = filteredResults[Math.min(filteredResults.indexOf(index) + 1, filteredResults.length - 1)];
	} else {
		index = Math.min(index + 1, results.length - 1);
	}
	displayContact();
}

function prevContact(){
	if (filter == true) {
		index = filteredResults[Math.max(filteredResults.indexOf(index) - 1, 0)];
	} else {
		index = Math.max(index - 1, 0);
	}
	displayContact();
}

//   Edit Contact Info.
function editContact()
{
	res = results[index];

 	$('#addFirst').val(res.fname);
	$('#addLast').val(res.lname);
	$('#addPhone').val(res.phonenumber);
	$('#addEmail').val(res.email);
	$('#addStreet').val(res.address);
	$('#addCity').val(res.city);
	$('#addState').val(res.state);
	$('#addZIP').val(res.zipcode);

	editing = 1;
	show('addContact', true);
	show('contacts', false);
}

//   Delete Contact.
function deleteContact()
{
	var url_delete = 'https://cop4331-9.herokuapp.com/delete';
	 
	 $.post(url_delete, results[index].contactId, function (res, status) {
          show('contact-info-flex', false);
     }).fail(function () {
          displayErr();
     });
}

//   Add new Contact Info
function addContact()
{
	if (editing == 1) {
		deleteContact();
		editing = 0;
	}

     var url_add = 'https://cop4331-9.herokuapp.com/add';

     let contactData = {
          firstName: $('#addFirst').val().trim(),
          lastName: $('#addLast').val().trim(),
          phone: $('#addPhone').val(),
		  email: $('#addEmail').val(),
          street: $('#addStreet').val(),
          city: $('#addCity').val(),
          state: $('#addState').val(),
          zip: $('#addZIP').val(),
     }

     //   Either First or Last name fields must be filled in to successfully
     //   create a contact.
     if (contactData.firstName == "" || contactData.lastName == "") {
          displayErr();
          return;
     }

     //   Post new contact info to create new Contact.
     $.post(url_add, contactData, function (res, status) {
		   
		   //clear text
		   clearText('addFirst');
		   clearText('addLast');
	       clearText('addPhone');
		   clearText('addEmail');
		   clearText('addStreet');
		   clearText('addCity');
		   clearText('addZIP');
		   
           show('addContact', false);
		   show('contacts', true);
		   editing = 0;
     }).fail(function () {
          displayErr();
     })
     loadContacts();
}

function goBack()
{
   show('addContact', false);
   show('contacts', true);
   if (editing == 1){
	   editing = 0;
   }
}

//   Sign out.
function signOut()
{
	$.get("/logout");
}