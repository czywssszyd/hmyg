/**
 * 1 输入框绑定事件 值改变事件 input事件
 *  1 获取到输入框的值
 *  2 合法性判断
 *  3 检验通过 把输入框的值 发送到后台
 *  4 返回的数据打印到页面上
 * 
 * 2 防抖(防止抖动) 定时器 节流
 *  0 防抖 一般 输入框中 防止重复输入 重复发送数据
 *  1 节流 一般是用在页面的下拉 和上拉
 * 
 * 定义全局 的定时器id
 */
import {request} from "../../request/index";
Page({

  data: {
    goods: [],
    isFocus: false,
    inpValue: ""
  },
  TimeId: -1,
  //输入框的值改变 就会触发的事件
  handleInput(e) {
    // console.log(e)
    //1 获取输入框的值
    const {value} = e.detail;
    //2 检测合法性
    if(!value.trim()) {
      //值不合法
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    //3 准备发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
      this.qsearch(value);
    },1000)
    
  },
  //发送请求获取搜索建议数据
  async qsearch(query) {
    const resr = await request({url:"/goods/qsearch", data: {query}});
    const res = resr.data.message;
    console.log(res)
    this.setData({
      goods: res
    })
  },
  //点击按钮 取消搜索
  handleCancle() {
    this.setData({
      inpValue: "",
      goods: [],
      isFocus: false
    })
  }
})