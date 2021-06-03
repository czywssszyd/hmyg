export const login = ()=>{
    return new Promise((resolve, reject)=>{
        wx.login({
            timeout:10000,
            success: (result) => {
             resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    })
}

//promise形式的微信小程序支付 pay是支付所必要的参数
export const requestPayment = (pay)=>{
    return new Promise((resolve, reject)=>{
       wx.requestPayment({
          ...pay,
           success: (result)=>{
               resolve(result)
           },
           fail: (err)=>{
            reject(err)
           },
           complete: ()=>{}
       });
    })
}