export default class WebSocketClient {
  ws: WebSocket | null;
  url: string;
  clientId: string;
  messageHandler: Function | null;
  constructor({url = '', clientId = ''}) {
    this.url = url;
    this.clientId = clientId;
    this.ws = null;
    this.messageHandler = null;
  }
  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('已连接到服务器');
      if (this.clientId) {
        this.init();
      }
    };

    this.ws.onmessage = (event) => {
      if(event.data instanceof Blob) {
        const message = this.#blobToString(event.data);
        if (typeof this.messageHandler === 'function') {
          this.messageHandler(message);
        }else {
          console.error('接收到服务器的响应:messageHandler必须是Function类型')
        }
      }else if(typeof event.data ==='string') {
        const message = event.data;
        if (typeof this.messageHandler === 'function') {
          this.messageHandler(message);
        }else {
          console.error('接收到服务器的响应:messageHandler必须是Function类型')
        }
      }else {
        console.log('接收到服务器的响应:数据类型异常')
      }
    };

    this.ws.onclose = () => {
      // 处理连接关闭事件
      console.log('与服务器的连接已关闭');
    };

    this.ws.onerror = (error) => {
      // 处理连接错误事件
      console.error(error);
    };
  }
  send(data: any) {
    const params = {
      clientId: this.clientId,
      data
    }
    const blob = new Blob([JSON.stringify(params, null, 2)], {
      type: "application/json",
    });
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(blob);
    }
  }
  init() {
    const params = {
      clientId: this.clientId,
    }
    const blob = new Blob([JSON.stringify(params, null, 2)], {
      type: "application/json",
    });
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(blob);
    }
  }

  setMessageHandler(handler: Function) {
    this.messageHandler = handler;
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  #blobToString(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        resolve(reader.result);
      };
  
      reader.onerror = reject;
      
      reader.readAsText(blob);
    });
  }
}