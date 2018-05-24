//   Initialize connection to server through URL.
const urlBase = 'https://cop4331-9.herokuapp.com'



//   Log in.
function login()
{
     var login = document.getElementById("user-login").value;
	var password = document.getElementById("password-login").value;
     var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/login';

     let data = {
          name: login,
          pw: pasword
     }

     let fetchData = {
          method: 'POST',
          body: data,
          headers: new Headers()
     }

     fetch(url, fetchData)
     .then(function() {
          // Handle response you get from the server
     });

     var xhr = new XMLHttpRequest();
     //   Hide all login fields
     hideOrShow('log-in', false);
     hideOrShow('Signup-btn', false);
     hideOrShow('Login-btn', false);

     //   Show all Contacts fields
     hideOrShow('contacts', true);
}






//   Log out.





//   Sign up.
function signup()
{
     //   Hide all login fields
     hideOrShow('log-in', false);
     hideOrShow('Signup-btn', false);
     hideOrShow('Login-btn', false);

     //   Show all Sign up fields
     hideOrShow('sign-up', true);

}

function createAccount()
{
     //   Get both password field values, and check if they match.
     var password = document.getElementById("password-signup").value;
     var rePass = document.getElementById("repassword-signup").value;

     //   Check to see if this can be done in real time as the password
     //   is being typed.
     if(password == rePass)
     {
          var firstName = document.getElementById("firstName").value;
          var lastName = document.getElementById("lastName").value;
          var email = document.getElementById("email").value;
          var userName = document.getElementById("user-signup").value;
     }

     //   Hide all Sign up fields
     hideOrShow('sign-up', false);

     //   Show all Sign up fields
     hideOrShow('log-in', true);
     hideOrShow('Signup-btn', true);
     hideOrShow('Login-btn', true);
}


//   Custom Functions.
function hideOrShow( elementId, showState )
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
