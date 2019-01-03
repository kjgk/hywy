import React from 'react'
import {Modal, Icon, Upload} from 'antd'
import {contentPath, apiPrefix} from "../../../utils/config"

const Dragger = Upload.Dragger

const modal = ({
                 item = {},
                 onOk,
                 onChange,
                 attachProgress,
                 ...modalProps
               }) => {

  const modalOpts = {
    ...modalProps,
    style: {width: 480},
    onOk: (e) => {
      e.preventDefault()
      onOk()
    },
    confirmLoading: modalProps.confirmLoading || attachProgress && attachProgress < 100,
    okText: '保存',
  }

  const uploaderProps = {
    action: `${contentPath}${apiPrefix}/file/upload`,
    multiple: true,
    accept: '.jpg,.pdf,.doc,.docx,.xls,.xlsx',
    listType: 'picture',
    onChange,
  };

  return (
    <Modal
      {...modalOpts}
    >
      <div>
        <Dragger {...uploaderProps}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">将文件拖曳到此处... (或者点击并选择文件)</p>
          <p className="ant-upload-hint">支持的文件类型：jpg pdf docx doc xls xlsx</p>
        </Dragger>
      </div>
    </Modal>
  )
}

export default modal