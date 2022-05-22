// create Token and saving it in cookie


const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
  
    // options for cookie
    // each cookie value for each user
    const options = {
      expires: new Date(Date.now() +process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // 24 hours
      ),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      user,
      token,
    });
  };
  
  module.exports = sendToken;




























// set time for cookie 
// function display() { 
//     var now = new Date();
//     var time = now.getTime();
//     var expireTime = time + 1000*36000;
//     now.setTime(expireTime);
//     document.cookie = 'cookie=ok;expires='+now.toUTCString()+';path=/';
//     //console.log(document.cookie);  // 'Wed, 31 Oct 2012 08:50:17 UTC'
//   }
  
// 1 Day = 24 Hrs = 24*60*60 = 86400
// httpOnly  using to protected cookies from server side 
// -> prevent from cookie steal

/*

Mục đích của thuộc tính httpOnly là bảo về cookie khỏi việc
truy cập trái phép từ browser. Chỉ lưu và gửi kèm cookie phản 
hồi từ client tới server. Việc hạn chế sự can thiệp từ trình duyệt 
giúp hạn chế rủi ro từ các cuộc tấn công đánh cắp cookie.
httponly được bật là true cho các cookies quan trọng
httponly luôn set là true cho các item cookies quan trọng (ngân hàng VIB)

*/