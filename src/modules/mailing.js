import moment from 'moment';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';

module.exports = async function (purpose, params) {
	try {
		let transporter, bodyMessage;

		if (process.env.SENDGRID_API) {
			transporter = transporterWithSendGrid(process.env.SENDGRID_API);
		} else {
			transporter = transporterWithoutSendGrid();
		}

		if (purpose === 'resert password') {
			bodyMessage = templateResetPassword(params.password);
		} else if (purpose === 'login') {
			bodyMessage = templateLogin(params);
		}

		const mailOptions = {
			from: 'contactozabax@gmail.com',
			to: params.email,
			replyTo: 'juanzabatta@gmail.com',
			subject: bodyMessage.subject,
			text: bodyMessage.text,
			html: bodyMessage.html,
		};

		await transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				return 'Error';
			} else {
				return 'Email sent.';
			}
		});
	} catch (error) {
		return 'Error';
	}
};

const transporterWithSendGrid = (url_api) => {
	return nodemailer.createTransport(
		sgTransport({
			auth: {
				api_key: url_api,
			},
		}),
	);
};

const transporterWithoutSendGrid = () => {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'contactozabax@gmail.com',
			pass: 'zabatta96',
		},
	});
};

const templateResetPassword = (password) => ({
	subject: 'Reinicio de contraseña | Home-tools',
	text: `Ha solicitado un reinicio de contraseña, 

      Su nueva contraseña es: ${password} 
      
      Por favor cambie ésta contraseña.`,
	html: `<html><body style="font-family:sans-serif; background-color:#FFFFF; font-size:14px; padding:16px 16px 16px 16px;">    
      <div style="color:#555; background-color:#eee; padding:16px 16px 16px 16px; max-width: 600px; margin: auto; text-align: center; box-shadow: 0px 0px 4px #ccc, 2px 2px 4px #ddd">
        <p>Ha solicitado un reinicio de contraseña, </p>
        <p>Su nueva contraseña es: <code style="background-color:#555555; color:#FFFFFF; padding:5px;">${password}</code></p>
        <p>Por favor cambie ésta contraseña.</p>
        </div>
    </body></html>`,
});

const templateLogin = (params) => ({
	subject: 'Nuevo inicio de sesión | Home-tools',
	text: `Estimado usuario,

Se ha detectado un nuevo inicio de sesión en su cuenta. Los datos de conexión son los siguientes:

Dirección IP: ${params.ip}

Ubicacion: ${params.geo.country} - ${params.geo.region} - ${params.geo.city}.

Fecha y hora de inicio: ${moment().format('DD/MM/YYYY HH:mm')}

Si no reconoce este inicio de sesión por favor cambie su contraseña.

Unsubscribe ( # )`,
	html: `<html><body style="font-family:sans-serif; background-color:#FFFFF; font-size:14px; padding:16px 16px 16px 16px;">    
      <div style="color:#555; background-color:#eee; padding:16px 16px 16px 16px; max-width: 600px; margin: auto; box-shadow: 0px 0px 4px #ccc, 2px 2px 4px #ddd">
        <div>
          <p>Estimado usuario,</p>
          <br/>
          <p>&nbsp;&nbsp;&nbsp;&nbsp; Se ha detectado un nuevo inicio de sesión en su cuenta. Los datos de conexión son los siguientes:</p>
          <p>Dirección IP: <span style="color:#000000">${params.ip}</span></p>
          <p>Ubicacion: <span style="color:#000000">${params.geo.country} - ${
		params.geo.region
	} - ${params.geo.city}</span></p>
          <p>Fecha y hora de inicio: <span style="color:#000000">${moment().format(
						'DD/MM/YYYY HH:mm',
					)}</span></p>
          <br/>
            <p style="text-align:Center;">
            Si no reconoce este inicio de sesión por favor cambie su contraseña. 
            </p>
        </div>        
        <p style="text-align:Center;">
          <a href="#" target="_blank">
            <small>Unsubscribe</small>
          </a>
        </p>
      </div>
    </body></html>`,
});
