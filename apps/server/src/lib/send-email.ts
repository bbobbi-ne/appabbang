/**
 * 사용자 이메일로 인증코드를 전송하는 기능
 */
import { AppError } from '@/types';
import nodemailer from 'nodemailer';

/** 인증번호를 사용자 이메일로 전달 */
export const sendEmail = async (email: string) => {
  if (!process.env.GMAIL_ID || !process.env.GMAIL_PASSKEY)
    throw AppError.internalServerError('이메일 인증번호 전송 과정에서 문제가 발생했습니다.');

  if (email) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSKEY,
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

/** 임시 비밀번호를 사용자 이메일로 전달 */
export const sendEmailTempPw = async (email: string, tempPw: string) => {
  if (!process.env.GMAIL_ID || !process.env.GMAIL_PASSKEY)
    throw AppError.internalServerError('임시 비밀번호를 이메일 전송 과정에서 문제가 발생했습니다.');

  if (email) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSKEY,
      },
    });

    await transporter.sendMail({
      from: '안녕하세요.', //보내는 주소 입력
      to: email, //위에서 선언해준 받는사람 이메일
      subject: '안녕하세요. 아빠빵입니다. (비밀번호 변경 안내)', //메일 제목
      text: `
        안녕하세요. 아빠빵입니다! 

        아빠빵 비밀번호 찾기 절차를 통해 고객님께서 입력하신 이메일로 비밀번호 재설정이 정상적으로 완료되었음을 알려드립니다.
        해당 임시 비밀번호는 로그인 화면에서 비밀번호 입력 칸에 작성하여 로그인 진행바랍니다.
        또한, 임시 비밀번호이므로 마이페이지에서 비밀번호 변경 작업을 권장합니다.

        임시 비밀번호 : ${tempPw}

        감사합니다.
      `, //내용
    });

    return tempPw;
  }
};

interface guestOrderPwSendEmailProp {
  ordererEmail: string;
  orderPw: string;
}

/** 주문 비밀번호를 비회원의 이메일로 전달 */
export const guestOrderPwSendEmail = async ({
  ordererEmail,
  orderPw,
}: guestOrderPwSendEmailProp) => {
  if (!process.env.GMAIL_ID || !process.env.GMAIL_PASSKEY)
    throw AppError.internalServerError(
      '비회원 임시 주문 비밀번호 이메일 전송 과정에서 문제가 발생했습니다.',
    );

  if (ordererEmail) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSKEY,
      },
    });

    await transporter.sendMail({
      from: '안녕하세요.', //보내는 주소 입력
      to: ordererEmail, //위에서 선언해준 받는사람 이메일
      subject: '안녕하세요. 아빠빵입니다. (비회원 주문 비밀번호 변경 안내)', //메일 제목
      text: `
        안녕하세요. 아빠빵입니다! 

        아빠빵 비회원 주문 비밀번호 찾기 절차를 통해 고객님께서 입력하신 이메일로 주문 비밀번호 재설정이 정상적으로 완료되었음을 알려드립니다.
        해당 임시 주문 비밀번호는 비회원 로그인 화면에서 주문 비밀번호 입력 칸에 작성 바랍니다.
        또한, 임시 비밀번호이므로 주문내역에서 비밀번호 변경 작업을 권장합니다.

        임시 비밀번호 : ${orderPw}

        감사합니다.
      `, //내용
    });
  }
};
