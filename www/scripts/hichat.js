window.onload = function(){

  var hiChar = new HiChar();
  hiChar.init();

}

function HiChar(){
  this.socket = null;
}

HiChar.prototype = {
  constructor: HiChar,
  init: function(){
    var that = this;
    this.socket = io.connect();
    this.socket.on('connect',function(){
      document.getElementById('info').textContent = '请设置您的聊天室临时昵称';
      document.getElementById('nickWrapper').style.display = 'block';
      document.getElementById('nicknameInput').focus();

      document.getElementById('loginBtn').addEventListener('click', function() {
        var nickName = document.getElementById('nicknameInput').value;
        //检查昵称输入框是否为空
        if (nickName.trim().length != 0) {
          //不为空，则发起一个login事件并将输入的昵称发送到服务器
          that.socket.emit('login', nickName);
        } else {
          //否则输入框获得焦点
          document.getElementById('nicknameInput').focus();
        };
      }, false);
    })
    this.socket.on('nickExisted', function() {
      document.getElementById('info').textContent = '!nickname is taken, choose another pls'; //显示昵称被占用的提示
    });
    this.socket.on('loginSuccess', function() {
      document.title = 'hichat | ' + document.getElementById('nicknameInput').value;
      document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
      document.getElementById('messageInput').focus();//让消息输入框获得焦点
    });
    this.socket.on('system', function(nickName, userCount, type) {
      //判断用户是连接还是离开以显示不同的信息
      var msg = nickName + (type == 'login' ? ' joined' : ' left');
      //指定系统消息显示为红色
      that._displayNewMsg('system ', msg, 'red');
      // var p = document.createElement('p');
      // p.textContent = msg;
      // document.getElementById('historyMsg').appendChild(p);
      //将在线人数显示到页面顶部
      document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
    });
    this.socket.on('newMsg', function(user, msg) {
      that._displayNewMsg(user, msg);
    });
    document.getElementById('sendBtn').addEventListener('click', function() {
      var messageInput = document.getElementById('messageInput'),
          msg = messageInput.value;
      messageInput.value = '';
      messageInput.focus();
      if (msg.trim().length != 0) {
          that.socket.emit('postMsg', msg); //把消息发送到服务器
          that._displayNewMsg('me', msg); //把自己的消息显示到自己的窗口中
      };
    }, false);
  },
  _displayNewMsg: function(user, msg, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
}