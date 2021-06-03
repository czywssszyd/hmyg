// pages/auth/auth.js
import {request} from '../../request/index'
import {login} from "../../utils/asyncWx"
Page({
  //获取用户信息
async handleGetUserInfo(e) {
  
   try {
      //1. 获取用户信息
    const {encryptedData,rawData,iv,signature}=e.detail;
    //2. 获取小程序登录成功后的code
    const {code} = await login();
    const loginParams = {encryptedData,rawData,iv,signature,code}
    
    //3. 发送请求 获取用户的token
    const res =await request({
      url:"/user/wxlogin",
      data:loginParams,
      method:"post"
    }) 
    
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
    //4 把token存入缓存中 同时跳转到上一页面
    wx.setStorageSync("token", token);
    wx.navigateBack({//返回上一页面
      delta: 1
    });
   } catch (error) {
     console.log(error)
   }
      
  } 
  
})