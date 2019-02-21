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

      // This is your API key that you retrieve from www.mailgun.com/cp
      var auth = {
        auth: {
          api_key: "",
          domain: ""
        }
      };

      var nodemailerMailgun = nodemailer.createTransport(mg(auth));

      nodemailerMailgun.sendMail(
        {
          from: '"Spices & Flavours" <offers@spicesnflavours.com>',
          to: `${req.body.email}`, // An array if you have multiple recipients.
          subject: "OFFER",
          "h:Reply-To": "no-reply",
          //You can use "html:" to send HTML email content. It's magic!
          html: `${msgBody}`,
          //You can use "text:" to send plain-text content. It's oldschool!
          text: "Mailgun rocks, pow pow!"
        },
        function(err, info) {
          if (err) {
            console.log("Error: " + err);
          } else {
            Counter.findById("5c66b994a3f3bf1a28df36ce").then(counter => {
              let newCount = ++counter.count;
              counter.count = newCount;

              counter.save();
            });

            newCustomer
              .save()
              .then(customer => res.json(customer))
              .catch(err => console.log(err));
          }
        }
      );

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
