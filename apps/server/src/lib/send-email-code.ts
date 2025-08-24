/**
 * 사용자 이메일로 인증코드를 전송하는 기능
 */
import nodemailer from 'nodemailer';

export const sendEmail = async (email: string) => {
  if (email) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: 'info@appabbang.com',
        pass: 'jvdopxgkimgykiam',
      },
    });

    // 인증번호 난수 생성
    let number = Math.floor(Math.random() * 1000000) + 100000;
    if (number > 1000000) number = number - 100000;

    await transporter.sendMail({
      from: '안녕하세요.', //보내는 주소 입력
      to: email, //위에서 선언해준 받는사람 이메일
      subject: '안녕하세요. 아빠빵입니다.', //메일 제목
      text: `
        안녕하세요. 아빠빵입니다! 
        회원가입 절차를 위한 이메일 인증을 위해 인증번호를 전달합니다.
        해당 인증번호는 회원가입 내 인증번호 입력칸에 작성 바랍니다.

        인증번호 : ${String(number)}

        감사합니다.
      `, //내용
    });

    return String(number);
  }
};
