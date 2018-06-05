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
	$.get(url_login, function (res, status) {
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

	$('#Name').innerHTML = res.fname + ' ' + res.lname;
	$('#Phone').innerHTML = res.phonenumber;
	$('#Email').innerHTML = res.email;
	$('#Street').innerHTML = res.address;
	$('#CityState').innerHTML = res.city + ', ' + res.state;
	$('#ZIP').innerHTML = res.zipcode;
	$('#fname').innerHTML = res.fname;
	$('#lname').innerHTML = res.lname;
	$('#city').innerHTML = res.city;
	$('#state').innerHTML = res.state;
}

//   Search for contact by Name.
function searchContact()
{
    var url_login = 'https://cop4331-9.herokuapp.com/contacts';
	let search = $('#search').value;
	$("#filter-text").innerHTML() = "Filtered by the term: \"" + search + "\".";
	$("$filter-info").show();
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

 	$('#addFirst').value = res.fname;
	$('#addLast').value = res.lname;
	$('#addPhone').value = res.phonenumber;
	$('#addEmail').value = res.email;
	$('#addStreet').value = res.address;
	$('#addCity').value = res.city;
	$('#addState').value = res.state;
	$('#addZIP').value = res.zipcode;

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
          firstName: $('#addFirst').value.trim(),
          lastName: $('#addLast').value.trim(),
          phone: $('#addPhone').value,
		  email: $('#addEmail').value,
          street: $('#addStreet').value,
          city: $('#addCity').value,
          state: $('#addState').value,
          zip: $('#addZIP').value,
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