let express = require('express');
let app = express();
let nodemailer = require('nodemailer');
const http = require('http'); // or 'https' for https:// URLs


app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.get('/getAll', () => {
    const fs = require('fs');

    const file = fs.createWriteStream("users.ods");
    let download = http.get("/var/www/InvitationScheme/storage/app/users.ods", function(response) {
        response.pipe(file);

        file.on("finish", () => {
            console.log(file);
            file.close();
            console.log("Download Completed");
        });
    });
    let options = {
        host: 'localhost',
        port: 8001,
        path: '/api/getAll',
        method: 'GET'
    }

    let request = http.request(options, function (res) {
        let data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            console.log(data);
            JSON.parse(data).map((user)=>{
                main(user).catch(console.error);
            })
        });
    });
    request.on('error', function (e) {
        console.log(e.message);
    });
    request.end();
});

app.listen('3001');

console.log('Your node server start successfully....');

exports = module.exports = app;


async function main(user) {
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "10229b47887200",
            pass: "828d6ae86e1e29"
        }
    });

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: user.email,
        subject: 'password reset',
        text: '',
        html: "<a href="+'http://127.0.0.1:8000/api/'+user.token+">Reset Password</a>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}