/**
 1 发送请求获取数据
 2.点击轮播图 预览大图
  1.给轮播图绑定点击事件
  2.调用小程序的api previewImage
3. 点击加入购物车
  1.先绑定点击事件
  2. 获取缓存中的购物车数据，数组格式
  3.先判读 当前商品是否已经存在于购物车中
  4.已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
  5.不存在 直接给购物车数组 添加一个新元素 带上数量的属性如 nums 填充回缓存
  6.弹出提示
4. 商品收藏
 1 页面onShow 的时候， 加载缓存中的商品收藏的数据
 2 判断当前商品是不是被收藏
  1. 是 改变页面的图标
  2. 不是。。。
  3。 点击商品的收藏按钮
    1. 判断该商品是否存在于缓存数组中
    2. 已经存在 把该商品删除
    3. 不存在 把商品添加到收藏数组中 存入到缓存中即可
 */

import {request} from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },

  goodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages =  getCurrentPages();
    console.log(pages);
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;

    const {goods_id} = options;
    this.getGoodsDetail(goods_id);
  },
  //获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({
      url: "/goods/detail",
      data: {goods_id}
    });
    this.goodsInfo = res.data.message;
     //1.获取缓存中的商品收藏的数组
     let collect = wx.getStorageSync("collect")|| [];
     //2.判断当前商品是否被收藏了
     let isCollect = collect.some(v=>v.goods_id=== this.goodsInfo.goods_id)
    // console.log(this.goodsInfo)
    this.setData({
      goodsObj: {
        goods_name: res.data.message.goods_name,
        goods_price: res.data.message.goods_price,
        //iPhone部分手机不识别 webg图片格式
        //首先找后台，让它修改格式
        //临时自己改  确保后台存在其他格式 1.webp -> 1.jpg
        goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g,".jpg"),
        pics: res.data.message.pics
      },
      isCollect
    })
  },
  //轮播图的大图预览效果
  handlePreviewImage(e) {
    //1.需要先构造要预览的图片数组
    //map构造新数组把旧数组里面的v.pics找出来
    const urls = this.goodsInfo.pics.map(v=>v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,// 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  //点击加入购物车
  handleAddCart() {
    //1 获取缓存中的购物车数组 第一次获取是一个空字符串 要做一个转换确保是一个数组格式
    let cart =wx.getStorageSync("cart") || [];
    //判断 商品对象是否已经存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id===this.goodsInfo.goods_id);
    if(index===-1) {
      //不存在 第一次添加
      this.goodsInfo.num = 1;
      //添加一个属性 记录复选框的选中状态
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo)
    }else {
      //已经存在购物车中 执行 num++
      cart[index].num++
    }
    //把购物车数组 重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //弹出提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 1500,
      mask: true,
    });
      
      
  },
  //点击收藏
  handleCollect() {
    let isCollect = false;
    //1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    //2.判断该商品是否已经被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    //3. 当index!=-1表示 已经收藏过了
    if(index!=-1){
      //在数组中删除该商品
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1500,
        mask: true,
      });
        
    }else{
      //没有收藏过
      collect.push(this.goodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 1500,
        mask: true
      });    
    }
    //4. 吧数组存入到缓存中
    wx.setStorageSync("collect", collect);
    //5. 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
      
  }
})