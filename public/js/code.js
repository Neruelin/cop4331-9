//   Initialize connection to server through URL.
const urlBase = 'https://cop4331-9.herokuapp.com'



//   Log in.
function login()
{
     var url_login = 'https://cop4331-9.herokuapp.com/login';
     var user = document.getElementById('user-login').value;

     let userdata = {
          username: document.getElementById('user-login').value,
          password: document.getElementById('password-login').value
     }

     console.log(JSON.stringify(userdata));

     let fetchdata = {
          method: 'POST',
          headers: { type: 'application/json' },
          body: JSON.stringify(userdata)
     }

     fetch(url_login, fetchdata)
     .then(response => {
          console.log(response)
     })
     .then(data => {
          console.log(data);
     })
     .catch((error) => {
          console.log('Something went wrong! ( In createAccount(); )', error)
     });
     // var login = document.getElementById("user-login").value;
	// var password = document.getElementById("password-login").value;
     // var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	// var url = urlBase + '/login';

     // fetch('https://cop4331-9.herokuapp.com/login');

     //   Hide all login fields
     //show('log-in', false);
     //show('Signup-btn', false);
     //show('Login-btn', false);

     //   Show all Contacts fields
     //show('contacts', true);
}






//   Log out.





//   Sign up.
function signup()
{
     //   Hide all login fields
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
          lastname: document.getElementById('firstName').value,
          email: document.getElementById('email').value,
          username: document.getElementById('user-signup').value,
     }

     //   Initialize fetchdata for posting.
     let fetchdata = {
          method: 'POST',
          headers: new Headers(),
          body: JSON.stringify(userdata)
     }

     fetch(url_signup, fetchdata)
     .then(response => response.json())
     .then(data => {
          console.log(data);
     })
     .catch((error) => {
          console.log('Something went wrong! ( In createAccount(); )', error)
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
