import './public-path'
import React from "react";
import ReactDOM from "react-dom";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Editor, ShortcutKey } from "amis-editor";
import { RouteComponentProps } from "react-router-dom";
import { toast, Select, Icon, registerIcon } from "amis";
import { currentLocale } from "i18n-runtime";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/css/v4-shims.css";
import "amis/lib/themes/default.css";
import "amis/lib/helper.css";
import "amis/sdk/iconfont.css";
import "amis-editor-core/lib/style.css";
// import 'amis-editor/dist/style.css';
import "./scss/style.scss";

class Store {
  // @observable pages = [
  //   {
  //     id: "1",
  //     icon: "fa fa-file",
  //     path: "hello-world",
  //     label: "Hello world",
  //     schema: {
  //       type: "page",
  //       title: "Hello world",
  //       body: [
  //         {
  //           type: "chained-select",
  //           label: "链式下拉",
  //           name: "chainedSelect",
  //           joinValues: true,
  //           id: "u:815adee0d471",
  //         },
  //       ],
  //       id: "u:517829721b18",
  //     },
  //   },
  // ];
  @observable pages = [];
  @observable theme = "cxd";
  @observable asideFixed = true;
  @observable asideFolded = false;
  @observable offScreen = false;
  @observable addPageIsOpen = false;
  @observable preview = false;
  @observable isMobile = false;
  // @observable schema = {
  //   type: "page",
  //   title: "Hello world",
  //   body: [
  //     {
  //       type: "chained-select",
  //       label: "链式下拉",
  //       name: "chainedSelect",
  //       joinValues: true,
  //       id: "u:815adee0d471",
  //     },
  //   ],
  //   id: "u:517829721b18",
  // };
  @observable schema = {}

  @action updateSchema(value) {
    this.schema = value;
  }

  @action setPreview(value) {
    this.preview = value;
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
    let host = `${window.location.protocol}//${window.location.host}`;
    const schemaUrl = `${host}/schema.json`;
    
    function save() {
      toast.success("保存成功", "提示");
    }

    function onChange(value) {
      // store.updateSchema(value);
      // store.schema = value;
    }

    function changeLocale(value) {
      localStorage.setItem("suda-i18n-locale", value);
      window.location.reload();
    }

    function exit() {
      // history.push(`/${store.pages[index].path}`);
      toast.success("退出了", "提示");
    }

    return (
      <div className="Editor-Demo">
        <div className="Editor-header">
          <div className="Editor-title">amis 可视化编辑器</div>
          <div className="Editor-header-actions">
            <ShortcutKey />
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
            {/* {!store.preview && (
              <div className={`header-action-btn exit-btn`} onClick={exit}>
                退出
              </div>
            )} */}
          </div>
        </div>
        <div className="Editor-inner">
          <Editor
            theme={"cxd"}
            preview={store.preview}
            isMobile={store.isMobile}
            value={store.schema}
            onChange={onChange}
            onPreview={() => {
              store.setPreview(true);
            }}
            onSave={save}
            className="is-fixed"
            $schemaUrl={schemaUrl}
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
  ReactDOM.unmountComponentAtNode(document.getElementById('root'))
}
ReactDOM.render(<App />, document.getElementById("root"));
