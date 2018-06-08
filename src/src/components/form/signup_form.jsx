import React from 'react';
import propTypes from 'prop-types';

import { Form, Input, Spin, Button, Radio} from 'antd';

import fetchData from '../../common/api';
import AvatarUpload from '../avatar_upload';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class signUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const { loading, form} = this.props;
        const {getFieldDecorator, getFieldValue} = form;
        return (
            <Spin spinning={loading} tip="注册中">
                <Form layout="vertical">
                    <FormItem label="用户名"
                        required={true}
                    >
                        {
                            getFieldDecorator('userName', {
                                rules: [
                                    {
                                        required: true,
                                        min: 3,
                                        max: 15,
                                        message: '用户名格式错误'
                                    },
                                    {
                                        validator: (rule, value, cb) => {
                                            if(!value) {
                                                cb();
                                            }
                                            fetchData('userNameExit', {
                                                userName: value
                                            }).then((res) => {
                                                if(!res.data.data.success) {
                                                    cb('这个用户名已经有人使用了!');
                                                }
                                                cb();
                                            });
                                        }
                                    }
                                ]
                            })(
                                <Input type="text" />
                            )
                        }
                    </FormItem>
                    <FormItem label="密码">
                        {
                            getFieldDecorator('passwd', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写密码'
                                    }
                                ]
                            })(
                                <Input type="password" />
                            )
                        }
                    </FormItem>
                    <FormItem label="重复密码">
                        {
                            getFieldDecorator('repasswd', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请再次输入密码'
                                    },
                                    {
                                        validator: (rule, repasswd, cb) => {
                                            repasswd === getFieldValue('passwd') ? cb() : cb('两次输入密码不一致');
                                        }
                                    }
                                ]
                            })(
                                <Input type="password" />
                            )
                        }
                    </FormItem>
                    <FormItem label="绑定验证码">
                        {
                            getFieldDecorator('code', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写绑定验证码，将用于绑定情侣'
                                    }
                                ]
                            })(<Input/>)
                        }
                    </FormItem>
                    <FormItem label="性别">
                        {
                            getFieldDecorator('sex', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择性别'
                                    }
                                ],
                                initialValue: 0
                            })(
                                <RadioGroup>
                                    <Radio value={0}>女</Radio>
                                    <Radio value={1}>男</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>
                    <FormItem label="昵称">
                        {
                            getFieldDecorator('nick', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写昵称'
                                    },
                                    {
                                        validator: (rule, value, cb) => {
                                            if(!value) {
                                                cb();
                                            }
                                            fetchData('nickExit', {
                                                nick: value
                                            }).then((res) => {
                                                if(!res.data.data.success) {
                                                    cb('这个昵称已经有人使用了!');
                                                }
                                                cb();
                                            });
                                        }
                                    }
                                ]
                            })(
                                <Input type="text" />
                            )
                        }
                    </FormItem>
                    <FormItem label="头像">
                        {
                            getFieldDecorator('file')(
                                <AvatarUpload
                                    action='/api/upload/avatar'
                                />
                            )
                        }
                    </FormItem>
                    <FormItem wrapperCol={{span: 20}}>
                        <Button type="primary" onClick={this.handleSubmit}>注册</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
    handleSubmit() {
        const { handleSignUp, form } = this.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            handleSignUp(values);
        });
    }
}

signUpForm.propTypes = {
    loading: propTypes.bool,
    form: propTypes.object,
    handleSignUp: propTypes.func
};

export default Form.create()(signUpForm);