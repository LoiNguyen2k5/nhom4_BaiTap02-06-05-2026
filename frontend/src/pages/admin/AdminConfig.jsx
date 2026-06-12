import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import configService from '../../services/configService';

const inputClass = "w-full h-10 px-3 text-[13px] font-mono tabular-nums border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors";
const labelClass = "block text-[12px] font-medium text-gray-700 mb-1.5";

const SECTIONS = [
  {
    title: 'Tỷ lệ đóng bảo hiểm (%)',
    sub: 'Tỷ lệ trừ lương nhân viên theo quy định pháp luật',
    cols: 3,
    fields: [
      { name: 'social_insurance_rate',        label: 'BH Xã hội (BHXH)',        step: '0.1' },
      { name: 'health_insurance_rate',         label: 'BH Y tế (BHYT)',           step: '0.1' },
      { name: 'unemployment_insurance_rate',   label: 'BH Thất nghiệp (BHTN)',    step: '0.1' },
    ],
  },
  {
    title: 'Quy định mức lương (VNĐ)',
    sub: 'Mức lương tham chiếu dùng trong tính toán bảo hiểm và hợp đồng',
    cols: 2,
    fields: [
      { name: 'base_salary',           label: 'Mức lương cơ sở',           step: '1000' },
      { name: 'max_insurance_salary',  label: 'Mức đóng bảo hiểm tối đa',  step: '1000' },
    ],
  },
  {
    title: 'Giảm trừ gia cảnh — Thuế TNCN (VNĐ)',
    sub: 'Mức giảm trừ áp dụng khi tính thuế thu nhập cá nhân',
    cols: 2,
    fields: [
      { name: 'personal_deduction',   label: 'Giảm trừ bản thân',          step: '100000' },
      { name: 'dependent_deduction',  label: 'Giảm trừ người phụ thuộc',   step: '100000' },
    ],
  },
];

const AdminConfig = () => {
  const [config, setConfig] = useState({
    social_insurance_rate: 8.0,
    health_insurance_rate: 1.5,
    unemployment_insurance_rate: 1.0,
    base_salary: 2340000,
    max_insurance_salary: 46800000,
    personal_deduction: 11000000,
    dependent_deduction: 4400000,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      const response = await configService.getTaxInsuranceConfig();
      if (response.data) setConfig(response.data);
    } catch {
      // Use default form values (already set in useState)
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await configService.updateTaxInsuranceConfig(config);
      setMessage({ type: 'success', text: 'Cập nhật cấu hình thành công!' });
    } catch (error) {
      console.error('Lỗi cập nhật cấu hình:', error);
      setMessage({ type: 'error', text: 'Cập nhật cấu hình thất bại.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Cấu hình thuế & bảo hiểm</h1>
        <p className="text-sm text-gray-500 mt-0.5">Quản lý các thông số dùng cho tính lương và khấu trừ thuế</p>
      </div>

      {/* Notification */}
      {message.text && (
        <div className={`flex items-center gap-2 border-l-[3px] rounded-md px-4 py-3 text-[13px]
          ${message.type === 'success'
            ? 'border-success-500 bg-success-50 text-success-700'
            : 'border-danger-500 bg-danger-50 text-danger-700'
          }`}>
          {message.type === 'success' && <CheckCircle size={14} strokeWidth={2} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {SECTIONS.map(section => (
          <div key={section.title} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-[14px] font-semibold text-gray-900">{section.title}</h2>
              <p className="text-[12px] text-gray-400 mt-0.5">{section.sub}</p>
            </div>
            <div className={`p-5 grid grid-cols-${section.cols} gap-4`}>
              {section.fields.map(field => (
                <div key={field.name}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    type="number"
                    step={field.step}
                    name={field.name}
                    value={config[field.name]}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-6 bg-accent-600 hover:bg-accent-700 disabled:opacity-60 text-white text-[13px] font-semibold rounded-md transition-colors"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </span>
            ) : 'Lưu cấu hình'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminConfig;
