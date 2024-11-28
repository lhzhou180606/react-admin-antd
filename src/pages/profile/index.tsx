import React, { useEffect, useState } from 'react';
import { Card, Menu, Form, Input, Button, Upload, message, Avatar, Badge, Statistic } from 'antd';
import { 
  UserOutlined, 
  SecurityScanOutlined,
  BellOutlined,
  ApiOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import type { MenuProps } from 'antd';
import DeviceManager from '@/components/DeviceManager';
import ApiTokenManager from '@/components/ApiTokenManager';
import NotificationSettings from '@/components/NotificationSettings';
import PasswordInput from '@/components/PasswordInput';
import PageTransition from '@/components/PageTransition';
import { authService } from '@/services/auth';
import classNames from 'classnames';

const Profile: React.FC = observer(() => {
  const { t } = useTranslation();
  const { UserStore } = useStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState('basic');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    UserStore.fetchDevices();
    UserStore.fetchApiTokens();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      await UserStore.updateProfile(values);
      message.success(t('profile.updateSuccess'));
    } catch (error) {
      message.error(t('profile.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      await UserStore.changePassword(values.oldPassword, values.newPassword);
      message.success(t('profile.passwordChanged'));
      form.resetFields(['oldPassword', 'newPassword', 'confirmPassword']);
    } catch (error) {
      message.error(t('profile.passwordChangeFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: RcFile) => {
    try {
      const response = await authService.uploadAvatar(file);
      message.success(t('profile.avatarUpdateSuccess'));
      return false;
    } catch (error) {
      message.error(t('profile.avatarUpdateFailed'));
      return Upload.LIST_IGNORE;
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'basic',
      icon: <UserOutlined />,
      label: t('profile.basicInfo'),
    },
    {
      key: 'security',
      icon: <SecurityScanOutlined />,
      label: t('profile.security'),
    },
    {
      key: 'notification',
      icon: <BellOutlined />,
      label: t('profile.notification'),
    },
    {
      key: 'api',
      icon: <ApiOutlined />,
      label: t('profile.apiAccess'),
    }
  ];

  const renderContent = () => {
    switch (activeKey) {
      case 'basic':
        return (
          <Card className="shadow-sm">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 flex justify-center">
                <Upload
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={handleAvatarUpload}
                >
                  <div className="text-center">
                    <Avatar
                      size={100}
                      src={UserStore.userInfo?.avatar}
                      icon={<UserOutlined />}
                      className="mb-4"
                    />
                    <div>
                      <Button icon={<UploadOutlined />}>
                        {t('profile.uploadAvatar')}
                      </Button>
                    </div>
                  </div>
                </Upload>
              </div>

              <Form
                layout="vertical"
                initialValues={UserStore.userInfo || {}}
                onFinish={handleProfileUpdate}
              >
                <Form.Item
                  name="username"
                  label={t('profile.username')}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={t('profile.email')}
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="mobile"
                  label={t('profile.mobile')}
                  rules={[
                    { required: true },
                    { pattern: /^1[3-9]\d{9}$/, message: t('profile.invalidMobile') }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {t('profile.save')}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <Card title={t('profile.changePassword')} className="shadow-sm">
              <div className="max-w-2xl mx-auto">
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={handlePasswordChange}
                >
                  <PasswordInput name="oldPassword" />
                  <PasswordInput
                    name="newPassword"
                    onChange={(strength) => console.log('Password strength:', strength)}
                  />
                  <PasswordInput
                    name="confirmPassword"
                    isConfirm
                    dependencies={['newPassword']}
                  />

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {t('profile.changePassword')}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Card>

            <Card title={t('profile.loginDevices')} className="shadow-sm">
              <DeviceManager
                devices={UserStore.devices}
                onRevokeAccess={UserStore.revokeDevice}
              />
            </Card>
          </div>
        );
      case 'notification':
        return (
          <NotificationSettings
            settings={UserStore.notificationSettings}
            onSettingChange={UserStore.updateNotificationSetting}
            notificationMode={UserStore.notificationMode}
            onModeChange={UserStore.setNotificationMode}
          />
        );
      case 'api':
        return (
          <Card className="shadow-sm">
            <ApiTokenManager
              tokens={UserStore.apiTokens}
              onCreateToken={UserStore.createApiToken}
              onRevokeToken={UserStore.revokeApiToken}
            />
          </Card>
        );
      default:
        return null;
    }
  };

  const UserInfoCard = () => (
    <Card bordered={false} className={classNames(
      "bg-white dark:bg-gray-800",
      { "sticky top-0": !isMobile }
    )}>
      <div className={classNames(
        "flex",
        isMobile ? "flex-row items-center" : "flex-col items-center"
      )}>
        <div className={classNames(
          isMobile ? "mr-4" : "mb-6",
          "flex-shrink-0"
        )}>
          <Badge count={5} offset={[-5, 5]}>
            <Avatar 
              size={isMobile ? 64 : 100}
              src={UserStore.userInfo?.avatar}
              icon={<UserOutlined />}
              className="shadow-lg"
            />
          </Badge>
        </div>
        <div className={classNames(
          "flex-grow",
          isMobile ? "text-left" : "text-center mb-6"
        )}>
          <h3 className="text-lg font-medium">{UserStore.userInfo?.username}</h3>
          <p className="text-gray-500">{UserStore.userInfo?.email}</p>
          <div className={classNames(
            "grid gap-4 mt-4",
            isMobile ? "grid-cols-3" : "grid-cols-2"
          )}>
            <Statistic title={t('profile.loginDays')} value={365} />
            <Statistic title={t('profile.lastActive')} value="2h" />
            {isMobile && (
              <div className="flex items-center justify-end">
                <Button type="primary" icon={<UploadOutlined />}>
                  {t('profile.uploadAvatar')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Menu
        mode={isMobile ? "horizontal" : "inline"}
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={({ key }) => setActiveKey(key)}
        className={isMobile ? "mt-4 border-t" : "mt-6"}
      />
    </Card>
  );

  return (
    <PageTransition>
      <div className="p-4 md:p-6">
        <div className={classNames(
          "flex",
          isMobile ? "flex-col space-y-4" : "flex-row gap-6"
        )}>
          {/* 左侧/顶部面板 */}
          <div className={classNames(
            isMobile ? "w-full" : "w-64 flex-shrink-0"
          )}>
            <UserInfoCard />
          </div>

          {/* 右侧/底部内容 */}
          <div className="flex-1">
            <Card bordered={false} className="bg-white dark:bg-gray-800">
              {renderContent()}
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
});

export default Profile; 