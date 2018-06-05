const urlBase = 'https://cop4331-9.herokuapp.com'

var index = 0;
var editing = 0;
var results;
var id = -1;

//   Display new contact fields to user to fill in.
function createContact()
{
     show('addContact', true);
	 show('contacts', false);
}

//   Display selected contact.
function displayContact()
{
	 
	  //doucment.getElementById('Name').value = res[0].fName + ' ' + res[0].lName;
	//var url_login = 'https://cop4331-9.herokuapp.com/contacts';
}

//   Search for contact by Name.
function searchContact()
{
	
     var url_login = 'https://cop4331-9.herokuapp.com/contacts';
	  let userdata = {
		  ID: id,
          search: document.getElementById('search').value,   
     }
	 //document.getElementById('Name').innerHTML = 'AAAAAAAAAAAAAAAAAAAAAAAAA';
	  $.post(url_login, userdata, function (res, status) {
          console.log(res);
      show('contact-info-flex', true);
	  index = 0;
	  results = res;
	  document.getElementById('Name').innerHTML = res[0].fname + ' ' + res[0].lname;
	  document.getElementById('Phone').innerHTML = res[0].phonenumber;
	  document.getElementById('Email').innerHTML = res[0].email;
	  document.getElementById('Street').innerHTML = res[0].address;
	  document.getElementById('CityState').innerHTML = res[0].city + ', ' + res[0].state;
	  document.getElementById('ZIP').innerHTML = res[0].zipcode;
	  document.getElementById('fname').innerHTML = res[0].fname;
	  document.getElementById('lname').innerHTML = res[0].lname;
	  document.getElementById('city').innerHTML = res[0].city;
	  document.getElementById('state').innerHTML = res[0].state;
     }).fail(function () {
          displayErr();
     })
	 
}

function nextContact(){
	
	index = Math.min(index + 1, results.length - 1);
	var res = results;
	  document.getElementById('Name').innerHTML = res[index].fname + ' ' + res[index].lname;
	  document.getElementById('Phone').innerHTML = res[index].phonenumber;
	  document.getElementById('Email').innerHTML = res[index].email;
	  document.getElementById('Street').innerHTML = res[index].address;
	  document.getElementById('CityState').innerHTML = res[index].city + ', ' + res[index].state;
	  document.getElementById('ZIP').innerHTML = res[index].zipcode;
	  document.getElementById('fname').innerHTML = res[index].fname;
	  document.getElementById('lname').innerHTML = res[index].lname;
	  document.getElementById('city').innerHTML = res[index].city;
	  document.getElementById('state').innerHTML = res[index].state;
}

function prevContact(){
	
	index = Math.max(index - 1, 0);
	var res = results;
	  document.getElementById('Name').innerHTML = res[index].fname + ' ' + res[index].lname;
	  document.getElementById('Phone').innerHTML = res[index].phonenumber;
	  document.getElementById('Email').innerHTML = res[index].email;
	  document.getElementById('Street').innerHTML = res[index].address;
	  document.getElementById('CityState').innerHTML = res[index].city + ', ' + res[index].state;
	  document.getElementById('ZIP').innerHTML = res[index].zipcode;
	  document.getElementById('fname').innerHTML = res[index].fname;
	  document.getElementById('lname').innerHTML = res[index].lname;
	  document.getElementById('city').innerHTML = res[index].city;
	  document.getElementById('state').innerHTML = res[index].state;
}
//   Edit Contact Info.
function editContact()
{
deleteContact();
editing = 1;
 document.getElementById('addFirst').value = document.getElementById('fname').innerHTML;
         document.getElementById('addLast').value = document.getElementById('lname').innerHTML;
          document.getElementById('addPhone').value = document.getElementById('Phone').innerHTML;
		  document.getElementById('addEmail').value = document.getElementById('Email').innerHTML;
          document.getElementById('addStreet').value = document.getElementById('Street').innerHTML;
          document.getElementById('addCity').value = document.getElementById('city').innerHTML;
          document.getElementById('addState').value = document.getElementById('state').innerHTML;
          document.getElementById('addZIP').value = document.getElementById('ZIP').innerHTML;
		   show('addContact', true);
	 show('contacts', false);
}

//   Delete Contact.
function deleteContact()
{
	var url_delete = 'https://cop4331-9.herokuapp.com/delete';
	 let contactData = {
		  ID: id,
          firstName: document.getElementById('fname').innerHTML,
          lastName: document.getElementById('lname').innerHTML,
          phone: document.getElementById('Phone').innerHTML,
		  email: document.getElementById('Email').innerHTML,
          street: document.getElementById('Street').innerHTML,
          city: document.getElementById('city').innerHTML,
          state: document.getElementById('state').innerHTML,
          zip: document.getElementById('ZIP').innerHTML
     }
	 
	 $.post(url_delete, contactData, function (res, status) {
          show('contact-info-flex', false);
     }).fail(function () {
          displayErr();
     })
}

//   Add new Contact Info
function addContact()
{
     var url_add = 'https://cop4331-9.herokuapp.com/add';

     let contactData = {
		  ID: id,
          firstName: document.getElementById('addFirst').value.trim(),
          lastName: document.getElementById('addLast').value.trim(),
          phone: document.getElementById('addPhone').value,
		  email: document.getElementById('addEmail').value,
          street: document.getElementById('addStreet').value,
          city: document.getElementById('addCity').value,
          state: document.getElementById('addState').value,
          zip: document.getElementById('addZIP').value,
     }

     //   Either First or Last name fields must be filled in to successfully
     //   create a contact.
     if (contactData.firstName == "" || contactData.lastName == "") {
          displayErr();
          return
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
		   if (editing === 1){
			   addContact();
		   }
}

//   Sign out.
function signOut()
{
     //show('loggedIn', false);

     //show('log-in', true);
	 window.location = '/login';
}