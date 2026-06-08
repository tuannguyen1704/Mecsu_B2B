import React, { useMemo, useState } from 'react';
import { Building2, User as UserIcon } from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { InfoSection } from './components/InfoSection';
import PersonalInfoEditModal, { PersonalInfoData } from './components/PersonalInfoEditModal';
import BusinessInfoEditModal, { BusinessInfoData } from './components/BusinessInfoEditModal';
import { AccountSecurityStatusSection } from './components/AccountSecurityStatusSection';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from './data/accountData';

const emptyValue = (value?: string) => value?.trim() || 'Chưa cập nhật';

const formatGender = (gender?: string) => {
  switch (gender) {
    case 'male':
      return 'Nam';
    case 'female':
      return 'Nữ';
    case 'other':
      return 'Khác';
    default:
      return 'Chưa cập nhật';
  }
};

const toPersonalFormData = (user: NonNullable<ReturnType<typeof useAuth>['user']>): PersonalInfoData => ({
  fullName: user.fullName || '',
  email: user.email || '',
  phone: user.phone || '',
  gender: user.gender || '',
  birthDate: user.birthDate || '',
});

const toBusinessFormData = (user: NonNullable<ReturnType<typeof useAuth>['user']>): BusinessInfoData => ({
  company: user.company || '',
  taxCode: user.taxCode || '',
  companyAddress: user.companyAddress || '',
});

const AccountInfoPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  const personalData = useMemo(() => {
    if (!user) return null;
    return toPersonalFormData(user);
  }, [user]);

  const businessData = useMemo(() => {
    if (!user) return null;
    return toBusinessFormData(user);
  }, [user]);

  if (!user || !personalData || !businessData) {
    return null;
  }

  const personalInfoItems = [
    { label: 'Họ và tên', value: emptyValue(user.fullName) },
    { label: 'Email', value: emptyValue(user.email) },
    { label: 'Số điện thoại', value: emptyValue(user.phone) },
    { label: 'Giới tính', value: formatGender(user.gender) },
    { label: 'Ngày sinh', value: user.birthDate ? formatDate(user.birthDate) : 'Chưa cập nhật' },
  ];

  const businessInfoItems = [
    { label: 'Tên công ty', value: emptyValue(user.company) },
    { label: 'Mã số thuế', value: emptyValue(user.taxCode) },
    { label: 'Địa chỉ công ty', value: emptyValue(user.companyAddress) },
    { label: 'Người phụ trách', value: emptyValue(user.companyRepresentative || user.fullName) },
    { label: 'Nhóm khách hàng', value: emptyValue(user.customerGroup || 'Khách hàng MECsu') },
    { label: 'Chiết khấu hiện tại', value: emptyValue(user.currentDiscount) },
  ];

  const handleSavePersonalInfo = (data: PersonalInfoData) => {
    updateProfile({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      birthDate: data.birthDate,
    });
  };

  const handleSaveBusinessInfo = (data: BusinessInfoData) => {
    updateProfile({
      company: data.company,
      taxCode: data.taxCode,
      companyAddress: data.companyAddress,
    });
  };

  return (
    <AccountLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Thông tin tài khoản</h1>
          <p className="mt-1 text-slate-500">Quản lý thông tin cá nhân và doanh nghiệp của bạn.</p>
        </div>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <InfoSection
            title="Thông tin cá nhân"
            items={personalInfoItems}
            icon={UserIcon}
            showEditButton
            onEditClick={() => setIsPersonalModalOpen(true)}
            className="rounded-[20px] border-[#E5EAF2] shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5"
          />

          <InfoSection
            title="Thông tin doanh nghiệp"
            items={businessInfoItems}
            icon={Building2}
            iconColor="blue"
            showEditButton
            onEditClick={() => setIsBusinessModalOpen(true)}
            className="rounded-[20px] border-[#E5EAF2] shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5"
          />
        </section>

        <AccountSecurityStatusSection user={user} />
      </div>

      <PersonalInfoEditModal
        isOpen={isPersonalModalOpen}
        onClose={() => setIsPersonalModalOpen(false)}
        data={personalData}
        onSave={handleSavePersonalInfo}
      />

      <BusinessInfoEditModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        data={businessData}
        onSave={handleSaveBusinessInfo}
      />
    </AccountLayout>
  );
};

export default AccountInfoPage;
