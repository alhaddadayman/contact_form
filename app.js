const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const key =require('./config/key')

//set up view engine
app.set(express.static(__dirname + "/views"));
app.set("view engine", "hbs");
app.use(express.static('public'))

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.get("/", (req, res) => {
  res.render("contactform");
});

app.post("/sendEmail", (req, res) => {
  console.log(req.body);
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
      return process.exit(1);
    }

    console.log("Credentials obtained, sending message...");

    function sendBack() {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: key.sendBackUser,
          pass: key.sendBackPass
        }
      });

      const mailOptions = {
        from: key.sendBackUser,
        to: req.body.email,
        subject: "Welcome...",
        html: "<h1>Hi, "+ req.body.username+ "</h1> <br> <p>" + "<h3>Thanks for your email,</h3> <br> <h4>this is auto reply message...</h4> <br> <br> <hr> <h1>Ayman Al Haddad </h1>"
      };
      console.log(mailOptions);
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log(info);
        res.redirect("/");
      });
    }

    var transporter = nodemailer.createTransport({
      host: key.mialtrapHost,
      port: 2525,
      auth: {
        user: key.mailtrapUser,
        pass: key.mailtrapPass
      }
    });

    const mailOptions = {
      from: req.body.email,
      to: " alhaddad.ayman91@gmail.com",
      subject: req.body.subject,
      html:
        "<h1>Hi, i am " +
        req.body.username +
        "</h1><br> <p> " +
        req.body.message +
        " </p>"
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      console.log(info);
      sendBack();
      res.redirect("/don");
    });
  });
});

app.get("/don", (req, res) => {
    res.render("don");
  });

app.listen(5008);
