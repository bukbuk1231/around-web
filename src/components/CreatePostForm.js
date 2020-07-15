import React from 'react';
import { Form, Input, Upload, Icon } from 'antd';
const FormItem = Form.Item;

// CreatePostForm class is wrapped by an high level wrapper
// this wrapper has a prop called getFieldDecorator
// once we wrap the class, to get the wrapper's props, we use this.props.form to access the wrapper form
// and get getFieldDecorator by const{ getFieldDecorator } = this.props.form
// and define this decorator ourselves
class CreatePostForm extends React.Component {
    beforeUpload = () => {
        return false;
    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    getWrapperForm = () => {
        return this.props.form;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Form layout="vertical">
                <FormItem
                    {...formItemLayout}
                    label="Message"
                >
                    {getFieldDecorator('message', {
                        rules: [{ required: true, message: 'Please input a message.' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Image"
                >
                    <div className="dropbox">
                        {getFieldDecorator('image', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            rules: [{ required: true, message: 'Please select a image.' }],
                        })(
                            <Upload.Dragger name="files" beforeUpload={this.beforeUpload}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        )}
                    </div>
                </FormItem>
            </Form>
        );
    }
}

// auto check. Form.create() returns a function, thus we pass CreatePostForm to it as parameter
// after passing, the form can auto check if the message field is empty or not
export const WrappedCreatePostForm = Form.create()(CreatePostForm);