const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, link }) => {
  try {
    const msg = {
      to,
      from: "wotzad@gmail.com",
      template_id: "d-35fe9a2b46864ef7ba8983efeb0366d2",
      dynamic_template_data: {
        link,
      },
    };
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendEmail,
};
