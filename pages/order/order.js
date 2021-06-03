/*
1 页面被打开的时候 onShow 
  1 获取url上的参数type 
  2 根据type 去发送请求 获取订单数据
  3 渲染页面
2. 点击不同的标题 重新发送请求 来获取和渲染数据

*/
import {request} from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        name: "全部",
        isActive: true
      },
      {
        id: 1,
        name: "待付款",
        isActive: false
      },
      {
        id: 2,
        name: "待发货",
        isActive: false
      },
      {
        id: 3,
        name: "退款/退货",
        isActive: false
      }
    ],
    orders: []
  },
  onShow(options){ //不同于onLoad 无法在形参上接收options参数
    const token = wx.getStorageSync("token");
      if(!token) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return;
      }
      


    // 1 获取当前的小程序的页面栈 长度最大是10个页面
    // 2 数组中 索引最大的页面就是当前页面
   let pages =  getCurrentPages();
   let currentPage = pages[pages.length-1];
   console.log(currentPage.options);
   //3. 获取url上的type参数
   const {type} = currentPage.options;
   this.getOrders({type});
    
  },
  async getOrders(type) {
    const res = await request({
      url: "/my/orders/all",
      data: {type}
    });
    
   this.setData({
     orders: res.orders
   })
  },
  handleTabsItemChange(e) {
    // console.log(e)
    //1. 获取被点击的标题索引
    const {index} = e.detail;
    //2 修改源数组 产生激活选中效果
    let {tabs} = this.data;
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    //3. 赋值到data中
    this.setData({
      tabs
    })
  },
})