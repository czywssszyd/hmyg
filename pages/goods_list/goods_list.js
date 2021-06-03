/**
 * 1.用户上滑页面，滚动条触底 开始加载下一页数据
 *  1.找到滚动触底事件
 *  2.判断还有没有下一页数据
 *    1. 获取到总页数 只有总条数
 *        总页数 = Math.ceil(总条数/页容量 pagesize)
 *        总页数 = Math.ceil(23/10)=3
 *    2.获取到当前的页码 pagenum
 *    3.判断一下 当前的页面是否大于等于总页数 大于等于表示没有下一页了
 *  3. 如果没有下一页的数据，弹出来一个提示
 *  4. 假如还有下一页数据 来加载下一页数据
 *      1. 当前的页码++
 *      2.重新发送请求
 *      3.数据请求回来后 拼接到之前的商品列表数组中
 * 
 * 2. 下拉刷新页面
 *    1.触发下拉刷新事件 需要再页面的json文件中开启一个配置项
 *    2.重置 数据 数组
 *    3.重置页码 设置为1
 *    4.重新发送请求
 * 
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
        name: "综合",
        isActive: true
      },
      {
        id: 1,
        name: "销量",
        isActive: false
      },
      {
        id: 2,
        name: "价格",
        isActive: false
      },
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  //总页数 
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },

  //获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    });
    // console.log(res);
    //获取 总条数
    const total = res.data.message.total;
    //计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
    console.log(this.totalPages)
    this.setData({
      //拼接了数组
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    });
    //关闭下拉刷新的等待效果
    wx.stopPullDownRefresh();
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
  //滚动条触底事件
  onReachBottom() {
    //1. 判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages) {
      //没有下一页数据
      wx.showToast({title: '我是有底线的！'}); 
    }else {
      //还有下一页数据
     
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh() {
   //重置数组
   this.setData({
     goodsList: []
   })
   //重置页码
   this.QueryParams.pagenum=1;
   //发送请求
   this.getGoodsList();
  }
})