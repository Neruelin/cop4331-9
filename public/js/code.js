//   Initialize connection to server through URL.
const urlBase = 'https://cop4331-9.herokuapp.com'



//   Log in.
function login()
{
     // var login = document.getElementById("user-login").value;
	// var password = document.getElementById("password-login").value;
     // var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	// var url = urlBase + '/login';

     fetch('https://cop4331-9.herokuapp.com/login');

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
     fetch('https://cop4331-9.herokuapp.com/signup')
     .then(function(response){
          return response.json();
     })
     .then(function(data){
          console.log(data);
     });
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
