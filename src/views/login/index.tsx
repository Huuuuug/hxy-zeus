import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Form, Input } from 'antd'

import { useAccountStore } from '@/store'
import { useLoginStyles } from '@/views/login/style'

type FormType = {
  username: string
  password: string
}

const Index: React.FC = () => {
  const { styles } = useLoginStyles()
  const { login } = useAccountStore()
  const navigate = useNavigate()

  const handleFormFinish = async (form: FormType) => {
    const res = await login(form)
    res && navigate('/')
  }
  return (
    <div className={styles.loginWrapper}>
      <Form name="login" onFinish={handleFormFinish}>
        <Form.Item
          label="username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Index
