/**
 * 1 获取用户的收货地址
 *  1.绑定点击事件
 *  2.调用小程序内置api 获取用户的收货地址 wx.chooseAddress
 * 2 获取用户对小程序所授权获取地址的权限 状态 scope
 *  1 假设用户点击获取地址的提示框 确定 scope值为true
 *  2.用户不给权限scope为false
 *  3.用户从来没有调用过收货地址api scope为undefined
 * 
 * 2 页面加载完毕后 获取本地存储中的地址数据 把数据 设置给data中的一个变量
 * 
 * 3 onShow 中做的事
 *  1 获取缓存中的购物车数组
 *  2 把购物车数据填充到data中
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //获取缓存冲的购物车数据
    const cart = wx.getStorageSync("cart")||[];
    this.setData({address})
    this.setCart(cart);

      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击收获地址
  handleChooseAddress() {
    // 获取收货地址
    wx.chooseAddress({
      success: (result) => {
        wx.setStorageSync("address", result);
          
      },
      fail: () => {},
      complete: () => {}
    });

    
   
  },
  //商品的选中
  handleItemChange(e) {
    //1.获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    //2. 获取购物车数组
    let {cart} = this.data;
    //3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //4.选中状态取反
    cart[index].checked = !cart[index].checked;
    //5 6 把购物车数据重新设置会data中和缓存中
    this.setCart(cart);
  },
  //设置购物车状态 同时 重新计算底部工具栏的数据 全选 总价格等
  setCart(cart) {
   
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    //判断数组是否为空
    allChecked = cart.length!=0?allChecked:false;
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }else{
        allChecked = false
      }
    })
    // 2 给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked 
    });
    wx.setStorageSync('cart', cart);
  },
  //商品的全选功能
  handleItemALLCheck() {
    //1. 获取data中的数据
    let {cart,allChecked} = this.data;
    //2. 修改值
    allChecked = !allChecked;
    //3.循环修改cart数组 中商品的选中状态
    cart.forEach(v=>v.checked=allChecked);
    //4.把修改后的值填充回data或者缓存中
    this.setCart(cart);
  },
  //商品数量的编辑功能
  handleItemNumEdit(e) {
    //1.获取传递过来的参数
    const {operation,id} = e.currentTarget.dataset;
    //2.获取购物车数组
    let {cart} = this.data;
    //3.找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id);
    //判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      wx.showModal({
        title: '提示',
        content: '您是否要删除商品？',
        success: (res)=> {
          if (res.confirm) {
            cart.splice(index,1);
            this.setCart(cart);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    }else{
      //4.进行修改数量
    cart[index].num+=operation;
    //5设置回缓存或者data中
    this.setCart(cart);
    }
    
  },
  //结算功能
  handlePay() {
    //1.判断收货地址
    const {address,totalNum} = this.data;
    if(!address.userName){
      wx.showToast({
        title: '您还没有选择收货地址',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {
          
        },
        fail: () => {},
        complete: () => {}
      });
        
      return
    }
    if(totalNum===0){
      wx.showToast({
        title: '您还没有选购商品',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {
          
        },
        fail: () => {},
        complete: () => {}
      });

      return
        
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',
    });
      
  }
})