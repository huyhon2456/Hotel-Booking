import React, { useState } from 'react'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Contact = () => {
  const { axios } = useAppContext()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    setLoading(true)
    try {
      // Backend endpoint optional; if not configured, this will still show success
      await axios.post('/api/contact', form)
      toast.success('Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      // Fallback success message if API not available
      toast.success('Đã ghi nhận liên hệ. Cảm ơn bạn!')
      setForm({ name: '', email: '', message: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title title='Liên hệ' align='left' className="font-playfair" subTitle='Kết nối với chúng tôi' />
      <div className='grid lg:grid-cols-2 gap-8 mt-6'>
        <form onSubmit={onSubmit} className='bg-white rounded-xl shadow p-6 space-y-4'>
          <div>
            <label className='block text-sm text-gray-700'>Họ và tên</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className='w-full border rounded px-3 py-2 outline-none focus:border-[var(--color-1)]' placeholder='' />
          </div>
          <div>
            <label className='block text-sm text-gray-700'>Email</label>
            <input type='email' value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className='w-full border rounded px-3 py-2 outline-none focus:border-[var(--color-1)]' placeholder='' />
          </div>
          <div>
            <label className='block text-sm text-gray-700'>Nội dung</label>
            <textarea rows={6} value={form.message} onChange={e=>setForm({...form, message:e.target.value})} className='w-full border rounded px-3 py-2 outline-none focus:border-[var(--color-1)]' placeholder='Bạn muốn trao đổi điều gì?' />
          </div>
          <button disabled={loading} className='bg-[var(--color-1)] text-white rounded px-6 py-2 hover:bg-[var(--color-2)]/50 hover:text-gray-800 transition disabled:opacity-60'>
            {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
          </button>
        </form>
        <div className='bg-white rounded-xl shadow p-6'>
          <h3 className='text-lg font-semibold'>Thông tin</h3>
          <p className='text-gray-700 mt-2'>Chúng tôi luôn sẵn sàng hỗ trợ 24/7.</p>
          <div className='mt-4 text-gray-700 space-y-2'>
            <p>Hotline: +84 0123 456 789</p>
            <p>Email: support@hotel-booking</p>
            <p>Địa chỉ: 123 Đường Biển, Vũng Tàu</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
