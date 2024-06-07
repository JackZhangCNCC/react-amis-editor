import React, { useState } from 'react';
import { Editor, setSchemaTpl, ShortcutKey } from 'amis-editor';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { toast, Select, confirm } from 'amis';
import { currentLocale } from 'i18n-runtime';
import { Icon } from '../icons/index';
import '../editor/DisabledEditorPlugin'; // 用于隐藏一些不需要的Editor预置组件
import '../renderer/MyRenderer';
import '../editor/MyRenderer';
import { types } from "mobx-state-tree";
import { InputJSONSchemaObject } from "amis-ui/lib/components/json-schema/Object";

let currentIndex = -1;

let host = `${window.location.protocol}//${window.location.host}`;

// 如果在 gh-pages 里面
if (/^\/amis-editor-demo/.test(window.location.pathname)) {
  host += '/amis-editor';
}

const schemaUrl = `${host}/schema.json`;

// const editorLanguages = [
//   {
//     label: '简体中文',
//     value: 'zh-CN'
//   },
//   {
//     label: 'English',
//     value: 'en-US'
//   }
// ];

export default inject()(
  observer(function ({
    match
  }: {} & RouteComponentProps<{ id: string }>) {
    const curLanguage = currentLocale(); // 获取当前语料类型
    // @ts-ignore
    let defaultSchema: any = AMIS_JSON;
    const [isMobile, setIsMobile] = useState(false);
    const [preview, setPreview] = useState(false);
    const [schema, setSchema] = useState(defaultSchema);
    const [ifFirst, setIfFirst] = useState(true);

    const id = match.params.id;
    function save() {
      confirm('确认要保存', '提示').then(confirmed => {
        if(confirmed) {
          updateSchema(schema)
          // console.log("👻 ~ App ~ 保存 ~ store.schema:", schema)
          window.microApp && window.microApp.forceDispatch({ type: '保存', data: schema }, () => {
            toast.success('保存成功', '提示');
            console.log('👻 ~ 保存请求的数据已经发送完成')
          })
        }
      });
    }

    function onChange(value: any) {
      setSchema(value);
      updateSchema(value)
    }
    function onInit() {
      //TODO 这段这么写是为了解决基座项目点修改进入编辑器有时候不渲染已有数据的情况 暂未找到更好解决方案
      // 2024.05.20已解决
      // setPreview(true);
      // setPreview(false);
    }

    // function changeLocale(value: string) {
    //   localStorage.setItem('suda-i18n-locale', value);
    //   window.location.reload();
    // }

    function updateSchema(value: any) {
      console.info("更新Schema", value);

      // @ts-ignore
      EDITOR_SAVE(value);
    }

    function exit() {
      confirm('确认要退出', '提示').then(confirmed => {
        confirmed && window.microApp && window.microApp.forceDispatch({ type: '退出' }, () => {
          clear()
          console.log('👻 ~ 退出请求的数据已经发送完成')
        })
      });
    }
    function clear() {
      // 清空当前子应用发送给主应用的数据
      window.microApp.clearData()
    }

    // 监听函数
    // function dataListener(data: any) {
    //   console.log('👻 ~ 来自主应用的数据', data)
    //   if (data.type == '获取修改前表单数据') {
    //     onChange(data.data)
    //   }
    // }

    // 主应用修改时传来的数据
    function dataFromVue() {
      // console.log('👻 ~ dataFromVue中')
      if(!window.microApp) return
      const data = window.microApp.getData()
      if (data) {
        if (data.type == '获取修改前表单数据' && ifFirst) {
          console.log('👻 ~ 首次获取的来自主应用的数据', data)
          setIfFirst(false)
          onChange(data.data)
        }
      }
    }

    dataFromVue()
    // window.microApp && window.microApp.addDataListener(dataListener)

    return (
      <div className="Editor-Demo">
        <div className="Editor-header">
          <div className="Editor-title">表单编辑器</div>
          {/* <div className="Editor-view-mode-group-container">
            <div className="Editor-view-mode-group">
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  !isMobile ? 'is-active' : ''
                }`}
                onClick={() => {
                  setIsMobile(false)
                }}
              >
                <Icon icon="pc-preview" title="PC模式" />
              </div>
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  isMobile ? 'is-active' : ''
                }`}
                onClick={() => {
                  setIsMobile(true)
                }}
              >
                <Icon icon="h5-preview" title="移动模式" />
              </div>
            </div>
          </div> */}

          <div className="Editor-header-actions">
            <ShortcutKey />
            {/*<Select*/}
            {/*  className="margin-left-space"*/}
            {/*  options={editorLanguages}*/}
            {/*  value={curLanguage}*/}
            {/*  clearable={false}*/}
            {/*  onChange={(e: any) => changeLocale(e.value)}*/}
            {/*/>*/}
            <div
              className={`header-action-btn m-1 ${preview ? 'primary' : ''
                }`}
              onClick={() => {
                setPreview(!preview);
              }}
            >
              {preview ? '编辑' : '预览'}
            </div>
            {!preview && (
              <div className={`header-action-btn`} onClick={save}>
                保存
              </div>
            )}

            {!preview && (
              <div className={`header-action-btn exit-btn`} onClick={exit}>
                退出
              </div>
            )}
          </div>
        </div>
        <div className="Editor-inner">
          <Editor
            theme={'cxd'}
            preview={preview}
            isMobile={isMobile}
            value={schema}
            onChange={onChange}
            onInit={onInit}
            onPreview={() => {
              setPreview(true);
            }}
            onSave={save}
            className="is-fixed"
            $schemaUrl={schemaUrl}
            showCustomRenderersPanel={true}
          />
        </div>
      </div>
    );
  })
);
