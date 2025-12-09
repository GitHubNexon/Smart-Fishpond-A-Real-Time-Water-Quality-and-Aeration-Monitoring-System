'use client';

import FormTab, { TabItem } from '@/components/customs/form-tab';
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  Landmark,
  Users,
  Briefcase,
} from 'lucide-react';
import PersonalInfoForm from './personal-info.form';
import ContactInfoForm from './contact-info.form';
import AddressInforForm from './address-info.form';
import GovernmentInfoForm from './government-info.form';
import FamilyInfoForm from './family-info.form';
import ChildrenInfoForm from './children-info.form';
import EducationInfoForm from './educational-info.form';
import WorkExperienceForm from './work-experience-info.form';

export default function EmployeeFormTab({
  formData,
  handleChange,
  handleContactNumberChange,
  handleSelectChange,
  setFormData,
  handleAddressChange,
}: ReturnType<typeof import('./employee-form-logic').default>) {
  const formTabs: TabItem[] = [
    {
      value: 'personal-info',
      label: 'Personal Information',
      icon: User,
      content: (
        <PersonalInfoForm
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          setFormData={setFormData}
        />
      ),
    },
    {
      value: 'contact-info',
      label: 'Contact Information',
      icon: Phone,
      content: (
        <ContactInfoForm
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          setFormData={setFormData}
        />
      ),
    },
    {
      value: 'address-info',
      label: 'Address Information',
      icon: MapPin,
      content: (
        <AddressInforForm
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          setFormData={setFormData}
          handleAddressChange={handleAddressChange}
        />
      ),
    },
    {
      value: 'government-info',
      label: 'Government Information',
      icon: Landmark,
      content: (
        <GovernmentInfoForm
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />
      ),
    },
    {
      value: 'family-info',
      label: 'Family Information',
      icon: User,
      content: (
        <FamilyInfoForm
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />
      ),
    },
    {
      value: 'children-info',
      label: 'Children Information',
      icon: Users,
      content: (
        <ChildrenInfoForm formData={formData} setFormData={setFormData} />
      ),
    },
    {
      value: 'education-info',
      label: 'Educational Information',
      icon: Landmark,
      content: (
        <EducationInfoForm
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />
      ),
    },
    {
      value: 'work-experience-info',
      label: 'Work Experience',
      icon: Briefcase,
      content: (
        <WorkExperienceForm formData={formData} setFormData={setFormData} />
      ),
    },
  ];

  return (
    <FormTab
      tabs={formTabs}
      defaultValue="personal"
      onTabChange={(value) => console.log('Tab changed to:', value)}
    />
  );
}
