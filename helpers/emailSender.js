const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const verification = async ({ to, link }) => {
  try {
    const msg = {
      to,
      from: "wotzad@gmail.com",
      template_id: "d-35fe9a2b46864ef7ba8983efeb0366d2",
      dynamic_template_data: {
        link,
      },
    };
    const send = await sgMail.send(msg);
    console.log("Email sent");
    return send
  } catch (error) {
    console.error(error);
  }
};
const restorePassword = async ({ to, link }) => {
  try {
    const msg = {
      to,
      from: "wotzad@gmail.com",
      template_id: "d-461aba6f7c304faba5790f789718a982",
      dynamic_template_data: {
        link,
      },
    };
    const send = await sgMail.send(msg);
    console.log("Email sent");
    return send;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  verification,
  restorePassword,
};
