import './public-path'
import React from "react";
import ReactDOM from "react-dom";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Editor, ShortcutKey } from "amis-editor";
import { toast, Select, Icon, registerIcon } from "amis";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/css/v4-shims.css";
import "amis/lib/themes/default.css";
import "amis/lib/helper.css";
import "amis/sdk/iconfont.css";
import "amis-editor-core/lib/style.css";
// import 'amis-editor/dist/style.css';
import "./scss/style.scss";

class Store {
  @observable pages = [];
  @observable theme = "cxd";
  @observable asideFixed = true;
  @observable asideFolded = false;
  @observable offScreen = false;
  @observable addPageIsOpen = false;
  @observable preview = false;
  @observable isMobile = false;
  @observable schema = {}

  @action updateSchema(value) {
    setTimeout(() => {
      console.log('👻 ~ 触发change，修改schema', value)
      this.schema.values = value;
    }, 100);
  }

  @action setPreview(value) {
    if(value == true) {
      localStorage.setItem('editting_schema', JSON.stringify(this.schema));
    }
    setTimeout(() => {
      this.preview = value;
    }, 100);
  }

  @action fetcher = (api, data) => {
    // 在这里实现异步请求逻辑
  }

  @action notify = (type, msg) => {
    // 在这里实现通知逻辑
  }

  @action alert = (msg) => {
    // 在这里实现警告逻辑
  }

  @action copy = (contents) => {
    // 在这里实现复制逻辑
  }
}
const store = new Store();

@observer
class App extends React.Component {
  render() {
    function save() {
      setTimeout(()=>{
        let data = {...store.schema.values, type: 'page'}
        console.log("👻 ~ App ~ 保存 ~ store.schema:", data)
        localStorage.setItem('editting_schema', JSON.stringify(data));
        window.microApp.forceDispatch({type: '保存'}, () => {
          console.log('👻 ~ 保存请求的数据已经发送完成')
        })
      }, 10)
    }

    function onChange(value) {
      store.updateSchema(value);
    }
    function onInit() {
      //TODO 这段这么写是为了解决基座项目点修改进入编辑器有时候不渲染已有数据的情况 暂未找到更好解决方案
      store.setPreview(true);
      store.setPreview(false);
    }

    function exit() {
      setTimeout(()=>{
        window.microApp && window.microApp.forceDispatch({type: '退出'}, () => {
          clear()
          console.log('👻 ~ 退出请求的数据已经发送完成')
        })
      }, 10)
    }
    function clear() {
      // 清空当前子应用发送给主应用的数据
      window.microApp.clearData()
    }

    function beforeReplace(e, f) {
      console.log("👻 ~ App ~ beforeReplace ~ e:", e)
      console.log("👻 ~ App ~ beforeReplace ~ f:", f)
    }
    // 监听函数
    function dataListener (data) {
      console.log('👻 ~ 来自主应用的数据', data)
    }

    window.microApp && window.microApp.addDataListener(dataListener)

    return (
      <div className="Editor-Demo">
        <div className="Editor-header">
          <div className="Editor-title">表单编辑器</div>
          <div className="Editor-header-actions">
            {/* <div className={`header-action-btn old-btn`} onClick={test}>
              Test
            </div>
            <div className={`header-action-btn old-btn`} onClick={toOld}>
              旧版
            </div> */}
            <ShortcutKey />
            <div className={`header-action-btn save-btn`} onClick={save}>
              保存
            </div>
            <div
              className={`header-action-btn m-1 ${
                store.preview ? "primary" : ""
              }`}
              onClick={() => {
                store.setPreview(!store.preview);
              }}
            >
              {store.preview ? "编辑" : "预览"}
            </div>
            {!store.preview && (
              <div className={`header-action-btn exit-btn`} onClick={exit}>
                退出
              </div>
            )}
          </div>
        </div>
        <div className="Editor-inner">
          <Editor
            ref={"aminos"}
            theme={"cxd"}
            preview={store.preview}
            isMobile={store.isMobile}
            value={(localStorage.getItem('editting_schema')&&localStorage.getItem('editting_schema')!=='{}'&&JSON.parse(localStorage.getItem('editting_schema')).id) ? JSON.parse(localStorage.getItem('editting_schema')) : store.schema.values}
            onChange={onChange}
            onInit={onInit}
            onPreview={() => {
              store.setPreview(true);
            }}
            onSave={save}
            beforeReplace={beforeReplace}
            className="is-fixed"
            showCustomRenderersPanel={true}
            amisEnv={{
              fetcher: store.fetcher,
              notify: store.notify,
              alert: store.alert,
              copy: store.copy,
            }}
          />
        </div>
      </div>
    );
  }
}

window.unmount = () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('amisRoot'))
}
ReactDOM.render(<App />, document.getElementById("amisRoot"));
