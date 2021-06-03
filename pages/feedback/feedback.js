// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        name: "体验问题",
        isActive: true
      },
      {
        id: 1,
        name: "商品、商家投诉",
        isActive: false
      }
     
    ],
    chooseImgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //标题点击事件 从子组件传递过来
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
  //点击加号 选择图片
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result)
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
      
  },
  //点击图片 移除
  handleRemoveImg(e) {
    const {index} = e.currentTarget.dataset;
    // console.log({index})
    let {chooseImgs} = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  }
})