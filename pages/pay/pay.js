// 微信支付 
/**
 * 1 哪些人 哪些账号 可以实现微信支付？
 *    1. 企业账号 2.企业账号的小程序后台中 必须给开发者 添加上白名单
 * 2.支付按钮
 *    1.先判断缓存中有没有token 
 *    2.没有的话跳转到授权页面 进行获取token
 *    3.有token...创建订单编号
 */

import { request } from "../../request/index";
import { requestPayment } from "../../utils/asyncWx";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //获取缓存冲的购物车数据
    //过滤后的购物车数组
    let cart = wx.getStorageSync("cart")||[];
    cart= cart.filter(v => v.checked);
    this.setData({address})

    //1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    })
    // 2 给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });  
  },
 // 点击 支付
async handleOderPay() {
  // 1.判断缓存中有没有token
  const token = wx.getStorageSync("token");
  //2. 判断
  if(!token) {
    wx.navigateTo({url: '/pages/auth/auth'});
      return
  } 
  //3.创建订单
  // 准备好请求头参数
  const header = {Authorization:token};
  //准备请求体参数
  const order_price = this.data.totalPrice;
  const consignee_addr = this.data.address.cityName;
  // console.log(consignee_addr)
  const cart = this.data.cart;
  let goods=[];
  cart.forEach(v =>goods.push({
    goods_id: v.goods_id,
    goods_number: v.num,
    goods_price: v.goods_price
  }))
  //4 准备发送请求 创建订单 获取订单编号
  const orderParams = {order_price,consignee_addr,goods};
  const res = await request({
    url: "/my/orders/create",
    method: "POST",
    data: orderParams,
    header
  })
  const {order_number} = res.data.message;
  // console.log(order_number);
  // console.log(res.data.message.order_number)
  //5.发起预支付接口
  const result= await request({
    url: "/my/orders/req_unifiedorder",
    method: "POST",
    header,
    data:{order_number}
  })
  // console.log(result)
  const {pay} = result.data.message;
  //6 发起微信支付
  const res_pay = await requestPayment({pay});
  //个人appid没有权限调用支付窗口 代码没问题
  console.log(res_pay)
  
 }
})