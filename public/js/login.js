const urlBase = 'https://cop4331-9.herokuapp.com'

function login()
{
     var url_login = 'https://cop4331-9.herokuapp.com/login';
     var user = $('#user-login').val();

     let userdata = {
          username: $('#user-login').val(),
          password: $('#password-login').val()
     }

     if (userdata.username == "" || userdata.password == "") {
          displayErr();
          return
     }

     console.log(JSON.stringify(userdata));
     $.post(url_login, userdata, function (res, status) {
		//id = res;
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

function createAccount()
{
     //   Initialize url.
     var url_signup = 'https://cop4331-9.herokuapp.com/signup';

     //   Initialize userdata
     let userdata = {
          firstname: $('#firstName').val(),
          lastname: $('#lastName').val(),
          email: $('#email').val(),
          username: $('#user-signup').val(),
	  password: $('#password-signup').val()
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