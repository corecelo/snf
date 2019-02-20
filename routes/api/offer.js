const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
var mg = require("nodemailer-mailgun-transport");

// Load Model
const Counter = require("../../models/Counter");
const Customer = require("../../models/Customer");
const CustomerData = require("../../models/CustomerData");

router.get("/customers", (req, res) => {
  Customer.find()
    .then(customer => res.json(customer))
    .catch(err => res.status(404).json({ notFound: "No Customer Found" }));
});

// @routes POST api/offer/counter
// @description increasing counter after 10 people
// @access public
router.post("/randomoffer", (req, res) => {
  Counter.findById("5c6bbd0af4cad211e11a15ce").then(counter => {
    const increCount = ++counter.count;
    if (increCount === 11) {
      const offers = [20, 25];
      let randomNumber = Math.floor(Math.random() * 2 + 1);

      const selectedOffer = offers[--randomNumber];

      res.json({ offerReceived: selectedOffer });

      let resetCount = 0;
      counter.count = resetCount;
      counter.save();
      return false;
    } else {
      const offers = [10, 15];
      let randomNumber = Math.floor(Math.random() * 2 + 1);

      const selectedOffer = offers[--randomNumber];

      res.json({ offerReceived: selectedOffer });
      return false;
    }
  });
});

// @routes POST api/offer/customer
// @description adding new customer
// @access public
router.post("/customer", (req, res) => {
  Customer.findOne({ email: req.body.email }).then(async customer => {
    if (customer) {
      res.status(404).json({
        msg: "You have not redeemed your last offer"
      });
    } else {
      const newCustomer = new Customer({
        name: req.body.name,
        email: req.body.email,
        offer: req.body.offer
      });

      let offerType;
      if (
        req.body.offer === 5 ||
        req.body.offer === 10 ||
        req.body.offer === 15 ||
        req.body.offer === 20 ||
        req.body.offer === 25
      ) {
        offerType = `You got ${req.body.offer}% on your next dining.`;
      } else {
        offerType = `Get a FREE ${req.body.offer} on your next dining.`;
      }

      const msgBody = `
        <h3>CONGRATULATION ${req.body.name}!!!</h3>
        <p>You have availed offer from SPICES & FLAVOURS<br />
        Offer Details:
        ${offerType}
        </p>`;

      // NodeMailer
      let transporter = nodemailer.createTransport({
        host: "smtp.stackmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "offersnf@spicesnflavours.com", // generated ethereal user
          pass: "Si78757875" // generated ethereal password
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Spices & Flavours" <offersnf@spicesnflavours.com>', // sender address
        to: `${req.body.email}`, // list of receivers
        subject: "Avail Offer ✔", // Subject line
        text: "Hello world body", // plain text body
        html: `${msgBody}` // html body
      };

      // send mail with defined transport obje
      let info = await transporter.sendMail(mailOptions);

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      Counter.findById("5c6bbd0af4cad211e11a15ce").then(counter => {
        let newCount = ++counter.count;
        counter.count = newCount;

        counter.save();
      });

      newCustomer
        .save()
        .then(customer => res.json(customer))
        .catch(err => console.log(err));
    }
  });
});

// @routes POST api/offer/customer/:id
// @description delete cutomer after redeem offer
// @access public
router.delete("/customer/:id", (req, res) => {
  Customer.findById(req.params.id).then(customer => {
    const customerFlag = new CustomerData({
      name: customer.name,
      email: customer.email,
      date: customer.date,
      offer: customer.offer
    });

    customerFlag.save();

    customer
      .remove()
      .then(() => res.json({ success: true }))
      .catch(err => res.status(404).json({ notFound: "User Not Found" }));
  });
});

// router.post("/addcount", (req, res) => {
//   const count = new Counter({
//     count: 0
//   });

//   count
//     .save()
//     .then(resopnse => res.json(resopnse))
//     .catch(err => console.log(err));
// });

router.get("/addcount", (req, res) => {
  Counter.findById("5c6bbd0af4cad211e11a15ce")
    .then(count => res.json(count))
    .catch(err => console.log(err));
});

// router.post("/resetcount", (req, res) => {
//   Counter.findById("5c6bbd0af4cad211e11a15ce")
//     .then(counter => {
//       counter.count = 0;
//       counter.save().then(count => {
//         res.json(count);
//       });
//     })
//     .catch(err => console.log(err));
// });

module.exports = router;
