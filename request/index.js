//同时发送异步请求代码的次数
let ajaxTimes = 0;

export const request = (params) => {
    //每次调用请求的方法让请求次数加1
    ajaxTimes++;
    //显示加载中的效果
    wx.showLoading({
        title: "正在玩命儿加载中！",
        mask: true,
    });

    //定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
           ...params,
           url: baseUrl+params.url,
           success: (result) => {
               resolve(result);
           },
           fail: (err) => {
               reject(err);
           },
           complete:()=>{//不管成功还是失败都会调用
                //每次请求发送完成后让发送次数减去1
                ajaxTimes--;
            if(ajaxTimes===0){
                //这样表示当所用的方法都请求成功后才执行
                wx.hideLoading();  
            }
             
           }
        }); 
    })
}