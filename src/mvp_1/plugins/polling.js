/**
 * 插件设计思路：
 *
 * 每个插件必须实现 mount 方法和 unmount 方法，用于注入 hooks 生命周期的安装的卸载
 */
class Plugin {
  plugin = (state, context) => {
    this.state = state;
    this.context = context;
  };
}

class Polling extends Plugin {
  constructor(options) {
    super();
    this.options = options;
  }
  interval = null;
  suspended = false;
  handleVisibilityChange = (e) => {
    if (document.hidden) {
      this.suspended = true;
    } else {
      this.suspended = false;
    }
  };
  handler = () => {
    if (!this.suspended) {
      this.context.run();
    }
  };
  mount = () => {
    this.interval = setInterval(() => {
      this.handler();
    }, this.options.pollingInterval);
    if (this.options.pollingWhenHidden) {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  };
  unmount = () => {
    clearInterval(this.interval);
    if (this.options.pollingWhenHidden) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  };
  static modifyOptions(options) {
    return options;
  }
  static modifyOptionsOrder = Infinity;
}

export default Polling;
