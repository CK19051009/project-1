const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_APP,
  },
});

module.exports.sendMail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Send mail using Nodejs",
    text: `Your OTP is ${otp}`,
    html: ` <h2>🔐 Mã OTP của bạn</h2>
                    <p>Xin chào,</p>
                    <p>Mã xác thực (OTP) của bạn là:</p>
                    <div class="otp">${otp}</div>
                    <p>Mã OTP này có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                    <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                    <div class="footer">Trân trọng,<br>Đội ngũ hỗ trợ</div>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Send email error!");
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
