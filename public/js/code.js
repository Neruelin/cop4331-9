//   Initialize connection to server through URL.
const urlBase = 'https://cop4331-9.herokuapp.com'

function displayErr () {
     if ($("#error").css("display") == "none"){
	   console.log("UHHH!")
          $("#error").slideToggle();
     }
}

//   Log in.
function login()
{
	console.log("DID YOU FUCKING CLICK ME, BINCH?");
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

}

//   Search for contact by Name.
function searchContact()
{
     var url_login = 'https://cop4331-9.herokuapp.com/contacts';
}

//   Edit Contact Info.
function editContact()
{

}

//   Delete Contact.
function deleteContact()
{

}

//   Add new Contact Info
function addContact()
{
     var url_add = 'https://cop4331-9.herokuapp.com/add';

     let contactData = {
          firstName: document.getElementById('addFirst').value,
          lastName: document.getElementById('addLast').value,
          phone: document.getElementById('addPhone').value,
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
