// Set the environment
var Environment = 'production';
var RegistredUser = {};

var AuthentificationServiceURL = null;

function SetupEnvironment()
{
	switch(Environment)
	{
		case 'git_developer':
			// Full access to testing engironment
			AuthentificationServiceURL = "./api/git_auth.php";
			break;
		case 'production_preview':
			// Read onny access to production database
			AuthentificationServiceURL = "./api/pre_prod.php";
			break;
		case 'production':
			// Only works from production server
			AuthentificationServiceURL = "http://www.aju.ro/api/auth.php";
			break;
	}
}

function GenerateSubmit(text, options)
{
	var row = $('<tr></tr>');
	var def = $('<td></td>').attr('colspan', 2).css('text-align', 'right');
	var submitButton = $('<input></input>').attr('type', 'submit').attr('value', text);
	var submitHolder = $('<div style="width: 100%; text-align:right"><div>').on('click', SubmitLoginForm);
	submitHolder.append(submitButton).append($('<div id="login_error_placeholder"></div>').css('text-align', 'left').css('color', 'red'));
	if(text != '')
	{
		def.append(submitHolder);
		def.append($('<hr>'));
	}
	for(i=0; i<options.length; i++)
	{
		def.append($('<a style="margin:3px">['+options[i].text+']</a>').css('color', 'blue').css('text-decoration', 'underline').on('click', options[i].onclick));
	}
	row.append(def);
	return row;
}

function ActionCompleted(a, b, c)
{
	var a = null;
}

function ActionAborted(a, b, c)
{
	var a = null;
}

function CustomAction()
{
	document.getElementById('post_editor').style.display = 'block';
	$("#login_placeholder a")[0].style.display = 'none'
}

function SubmitLoginForm()
{
	var json_data = {};
	$.map( $("#login_placeholder :input"), function(n, i) 
	{
		if(n.name)
		{
			var value = $(n).val();
			if(n.name == 'password' && n.name == 'password2')
			{
				value = (value); // TO DO: MD5
			}
			json_data[n.name] = value;
		} 
	} );
	
	$.ajax(
	{
		type: "POST",
		url: AuthentificationServiceURL,
		data: JSON.stringify(json_data),
		contentType: "application/json; charset=utf-8",
        dataType: 'json'
	})
	.done(function(result, error, sender) 
	{
		if(result.status.success)
		{
			switch(result.status.code) 
			{
    			case 'login':
        			RenderViewLogin();
				break;
				case 'logout':
        			RenderViewLogout(result.result[0].username);
				break;
			}
			$("#login_error_placeholder").html(result.status.message);
		}
		else
		{
			$("#login_error_placeholder").html(result.status.message);
		}
	})
	.fail(function(sender, error, message)
	{
		//alert( "error" );
	})
	.always(function(sender, error, message) 
	{
		//alert( "complete" );
	});;
	return json_data;
}

function GenerateTitle(text, options)
{
	var row = $('<tr></tr>');
	var def = $('<td></td>').attr('colspan', 2).css('text-align', 'right');
	var submitButton = $('<input></input>').attr('type', 'submit').attr('value', text);
	var submitHolder = $('<div style="width: 100%; text-align:right"><div>');
	submitHolder.append(submitButton).append($('<div id="login_error_placeholder"></div>'));
	def.append($('<div>'+text+'</div>').css('color', 'gray'));
	row.append(def);
	def.append($('<hr>'));
	return row;
}

function GenerateInputHiddenElement(fieldName, value)
{
	var input = $('<input></input>').attr('type', 'hidden').attr('name', fieldName).attr('value', value);
	return input;
}

function GenerateInputTextElement(label, fieldName)
{
	var row = $('<tr></tr>');
	var label = $('<td>'+label+'</td>');
	var input = $('<td></td>').append($('<input></input>').attr('type', 'text').attr('name', fieldName));
	row.append(label);
	row.append(input);
	return row;
}

function GenerateInputPasswordElement(label, fieldName)
{
	var row = $('<tr></tr>');
	var label = $('<td>'+label+'</td>');
	var input = $('<td></td>').append($('<input></input>').attr('type', 'password').attr('name', fieldName));
	row.append(label);
	row.append(input);
	return row;
}

var RenderViewLogin = function ()
{
	var form = $('<table></table>').css('width', '100%');
	form.append(GenerateTitle('Login'));
	form.append(GenerateInputTextElement('Email', 'email'));
	form.append(GenerateInputPasswordElement('Parola', 'password'));
	form.append(GenerateSubmit('Login!', [{"text":'Am uitat parola!', "onclick":RenderViewRecover }, {"text":'Înregistrare', "onclick":RenderViewRegister}]));
	$("#login_placeholder")
		.empty()
		.append(GenerateInputHiddenElement('user_action', 'user_action_login'))
		.append(form);
	return form; 
}

function RenderViewLogout(username)
{
	$("#login_placeholder")
		.empty()
		.append('Welcome <span style="color:red">'+username+'</span> !<br><span style="color:blue" onclick="SubmitLoginForm()">Logout</span>')
		.append(form);
	var form = $('<table></table>').css('width', '100%');
	form.append(GenerateTitle('Salut <span style="color:red">'+username+'</span>!'));
	form.append(GenerateSubmit('', [{"text":' Adaugă și tu un anunț. <b style="color:red"> GRATUIT </b> ', "onclick":CustomAction }, {"text":'Logout!', "onclick":SubmitLoginForm }]));
	$("#login_placeholder")
		.empty()
		.append(GenerateInputHiddenElement('user_action', 'logout'))
		.append(form);
	return form; 
}
var RenderViewRegister = function ()
{
	var form = $('<table></table>').css('width', '100%');
	form.append(GenerateTitle('Ca să pui anunțuri trebuie să te loghezi'));
	form.append(GenerateInputTextElement('Email', 'email'));
	form.append(GenerateInputPasswordElement('Parola', 'password'));
	form.append(GenerateSubmit('Înregistrare!', [{"text":'Login', "onclick":RenderViewLogin}]));
	$("#login_placeholder")
		.empty()
		.append(GenerateInputHiddenElement('user_action', 'user_action_register'))
		.append(form);
	return form; 
}
var RenderViewRecover = function ()
{
	var form = $('<table></table>').css('width', '100%');
	form.append(GenerateTitle('Recuperează parola'));
	form.append(GenerateInputTextElement('Email', 'email'));
	form.append(GenerateSubmit('Send!', [{"text":'Login', "onclick":RenderViewLogin}, {"text":'Înregistrare', "onclick":RenderViewRegister}]));
	$("#login_placeholder")
		.empty()
		.append(GenerateInputHiddenElement('user_action', 'user_action_recover_password'))
		.append(form);
	return form; 
}

function GenerateLoginComponents()
{

	if(RegistredUser.username!='')
	{
		RenderViewLogout(RegistredUser.username);
	}
	else
	{
		RenderViewRegister();
	}
}

$(function() 
{
	SetupEnvironment();
	GenerateLoginComponents();
});