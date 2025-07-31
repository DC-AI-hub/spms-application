import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Form } from '@bpmn-io/form-js';

//import '@bpmn-io/form-js'

import '@bpmn-io/form-js/dist/assets/form-js-base.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/properties-panel.css';
import '@bpmn-io/form-js/dist/assets/form-js-playground.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor-base.css';
//import '@bpmn-io/form-js/dist/assets/draggle.css';



/**
 * FormComponent - Renders a dynamic form based on formJS configuration
 * @param {Object} props - Component props
 * @param {Object} props.schema - Form schema definition
 * @param {Function} props.onSubmit - Form submission handler
 */
const FormComponent = ({ schema = { fields: [] }, onSubmit }) => {
  const formContainer = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!formContainer.current) return;

    // 初始化表单实例
    const form = new Form({
      container: formContainer.current,
    });

    // 导入表单定义（JSON 格式）
    const schema = {
      type: "default",
      components: [
        {
          type: "text",
          label: "用户名",
          key: "username"
        },
        {
          type: "button",
          label: "提交",
          action: "submit"
        }
      ]
    };

    form.importSchema(schema)
      .then(() => console.log("表单加载成功"))
      .catch(err => console.error("表单加载失败", err));

    formRef.current = form;

    return () => form.destroy(); // 卸载时销毁实例
  }, []);

  return <div ref={formContainer} />;
};

export default FormComponent;
