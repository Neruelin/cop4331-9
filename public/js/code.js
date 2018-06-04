//   Initialize connection to server through URL.
const urlBase = 'https://cop4331-9.herokuapp.com'

function displayErr () {
     if ($("#error").css("display") == "none"){
          $("#error").slideToggle();
     }
}

//   Log in.
function login()
{
     var url_login = 'https://cop4331-9.herokuapp.com/login';
     var user = document.getElementById('user-login').value;

     let userdata = {
          username: document.getElementById('user-login').value,
          password: document.getElementById('password-login').value
     }

     if (userdata.username == "" || userdata.password == "") {
          displayErr();
          return
     }

     console.log(JSON.stringify(userdata));
     $.post(url_login, userdata, function (res, status) {
	  window.location = '/dashboard';
     }).fail(function () {
          displayErr();
     })

//   **** If login successfull do this....  ****
     if(status == 200)
     {
          //   Hide all login fields
          show('log-in', false);

          //   Show all Contacts fields
          show('loggedIn', true);
          show('contacts', true);
     }
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
	 
	  //doucment.getElementById('Name').value = res.fName + ' ' + res.lName;
	//var url_login = 'https://cop4331-9.herokuapp.com/contacts';
}

//   Search for contact by Name.
function searchContact()
{
	
     var url_login = 'https://cop4331-9.herokuapp.com/contacts';
	  let userdata = {
          search: document.getElementById('search').value,   
     }
	 //document.getElementById('Name').innerHTML = 'AAAAAAAAAAAAAAAAAAAAAAAAA';
	  $.post(url_login, userdata, function (res, status) {
      show('contact-info-flex', true);
	  document.getElementById('Name').innerHTML = res.fname + ' ' + res.lname;
	  document.getElementById('Phone').innerHTML = res.phonenumber;
	  document.getElementById('Email').innerHTML = res.email;
	  document.getElementById('Street').innerHTML = res.address;
	  document.getElementById('CityState').innerHTML = res.city + ', ' + res.state;
	  document.getElementById('ZIP').innerHTML = res.zipcode;
	  document.getElementById('fname').innerHTML = res.fname;
	  document.getElementById('lname').innerHTML = res.lname;
	  document.getElementById('city').innerHTML = res.city;
	  document.getElementById('state').innerHTML = res.state;
     }).fail(function () {
          displayErr();
     })
	 
}

//   Edit Contact Info.
function editContact()
{
deleteContact();
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
          firstName: document.getElementById('addFirst').value,
          lastName: document.getElementById('addLast').value,
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
           show('addContact', false);
		   show('contacts', true);
     }).fail(function () {
          displayErr();
     })
}

function goBack()
{
           show('addContact', false);
		   show('contacts', true);
}

//   Sign out.
function signOut()
{
     show("loggedIn", false);

     show("log-in", true);
	 window.location = '/login';
}

//   Sign up.
function signup()
{
     //   Hide all login fields
     show('error', false);
     show('log-in', false);
     show('Signup-btn', false);
     show('Login-btn', false);

     //   Show all Sign up fields
     show('sign-up', true);

}

// Terribly ugly function needs a lot of work!!
function createAccount()
{
     //   Initialize url.
     var url_signup = 'https://cop4331-9.herokuapp.com/signup';

     //   Initialize userdata
     let userdata = {
          firstname: document.getElementById('firstName').value,
          lastname: document.getElementById('lastName').value,
          email: document.getElementById('email').value,
          username: document.getElementById('user-signup').value,
	  password: document.getElementById('password-signup').value
     }

     $.post("/signup", userdata, function (res, status) {
          console.log(status);
     }).fail(function() {
          alert("signup failed");
     });

     //   Clear all text fields.
     clearText('firstName');
     clearText('lastName');
     clearText('email');
     clearText('user-signup');
     clearText('password-signup');
     clearText('repassword-signup');

     //   Hide all Sign up fields
     show('sign-up', false);

     //   Show all Sign up fields
     show('log-in', true);
     show('Signup-btn', true);
     show('Login-btn', true);
}


//        ++===============================================++
//        ||                 Helper Functions              ||
//        ++===============================================++

//   Turn elements display/visiblity on/off.  (Credit Professor Leinecker)
function show( elementId, showState )
{
	var vis = "visible";
	var dis = "flex";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}

	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}

//   Clear text from previously used text fields.
function clearText(elementId)
{
     document.getElementById(elementId).value = '';
}
