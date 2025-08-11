import React from 'react'
import Title from '../components/Title'

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: 'Mẹo đặt phòng tiết kiệm chi phí',
      date: '11/08/2025',
      excerpt: 'Những mẹo nhỏ giúp bạn đặt phòng khách sạn với giá tốt nhất mà vẫn đảm bảo trải nghiệm.',
    },
    {
      id: 2,
      title: 'Top điểm đến nghỉ dưỡng 2025',
      date: '05/08/2025',
      excerpt: 'Khám phá những địa điểm đẹp nhất cho kỳ nghỉ sắp tới của bạn.',
    },
    {
      id: 3,
      title: 'Checklist trước khi nhận phòng',
      date: '28/07/2025',
      excerpt: 'Danh sách kiểm tra nhanh để đảm bảo kỳ nghỉ suôn sẻ và thoải mái.',
    },
  ]

  return (
    <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title title='Blog' align='left' className="font-playfair" subTitle='Chia sẻ kinh nghiệm và cảm hứng du lịch' />
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
        {posts.map(p => (
          <article key={p.id} className='bg-white rounded-xl shadow p-5 hover:shadow-lg transition'>
            <h3 className='text-xl font-semibold'>{p.title}</h3>
            <p className='text-xs text-gray-500 mt-1'>{p.date}</p>
            <p className='text-sm text-gray-700 mt-3'>{p.excerpt}</p>
            <button className='mt-4 text-[var(--color-1)] hover:underline'>Đọc thêm</button>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Blog
