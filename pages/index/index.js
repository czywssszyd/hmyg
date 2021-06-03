//Page Object
// 引入用来发送请求的方法
import {request} from "../../request/index"
Page({
  data: {
    //轮播图数据
    swiperList: [],
    //导航数据
    catesList: [],
    //楼层数据
    floorList: []
  },
  //options(Object)
  onLoad: function(options) {
    // request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    // }).then(result => {
    //   this.setData({
    //     swiperList: result.data.message
    //   })
    // }) 
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  //获取轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata',
    }).then(result => {
      this.setData({
        swiperList: result.data.message
      })
    })
  },
  //获取导航数据
  getCatesList() {
    request({
      url: '/home/catitems',
    }).then(result => {
      this.setData({
        catesList: result.data.message
      })
    })
  },
  //获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata',
    }).then(result => {
      this.setData({
        floorList: result.data.message
      })
    })
  }
});
  