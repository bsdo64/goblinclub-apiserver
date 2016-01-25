/**
 * Created by dobyeongsu on 2015. 11. 4..
 */
module.exports = {
  User: {
    email: {
      notEmpty: {
        args: true,
        msg: '이메일을 입력해주세요'
      },
      isEmail: {
        args: true,
        msg: '이메일을 입력해주세요'
      }
    },
    nick: {
      len: {
        args: [2, 12],
        msg: '닉네임을 최소 2자 최대 12자 입력해주세요'
      }
    },
    password: {
      is: {
        args: /([A-Za-z0-9])\w+/g,
        msg: '비밀번호는 6~21자리 숫자와 문자를 입력해주세요'
      }
    }
  }
};
