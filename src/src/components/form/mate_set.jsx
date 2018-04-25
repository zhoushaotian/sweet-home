import React from 'react';
import propTypes from 'prop-types';

import { Form, Spin, Button, Tag } from 'antd';
import SearchInput from '../search_input';

const FormItem = Form.Item;

class MateSet extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const {form, mate} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Spin
                spinning={false}
                tip="保存中"
            >
                {mate ? (
                    <div>
                        <span>你已成功设置另一半,现在 <Tag color="gold">{mate.nick}</Tag>可以看到你记录的事件</span>
                    </div>
                ) : (
                    <Form layout="vertical">
                        <FormItem
                            label="选择用户"
                        >
                            {getFieldDecorator('userId', {
                                rules: [{
                                    required: true,
                                    message: '请选择用户'
                                }]
                            })(
                                <SearchInput/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                        </FormItem>
                    </Form>
                )}
            </Spin>
        );
    }
    handleSubmit() {
        const { form, onSubmit } = this.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            onSubmit(values);
        });
    }
}

MateSet.propTypes = {
    loading: propTypes.bool,
    form: propTypes.object,
    onSubmit: propTypes.func,
    mate: propTypes.any
};

export default Form.create()(MateSet);