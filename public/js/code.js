//   Initialize connection to server through URL.




//   Log in.
function login()
{
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
