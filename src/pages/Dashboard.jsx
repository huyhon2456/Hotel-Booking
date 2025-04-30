import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
const Dashboard = () => {
  return (
    <div>
      <Title align='left' font='Rubik' title='Dashboard' subTitle='hahahaa' />
      <div className='flex gap-4 my-8'>
        {/*tống lượt booking */}
        <div className='bg-[var(--color-heavy)] border border-[var(--color-secondary)] rouded flex p-4 pr-8'>
          <img src={assets.booking_icon} alt="" className='max-sm:hidden h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-[var(--color-secondary)] text-lg'>Total Bookings</p>
            <p className='text-[var(--color-four)] text-base'>250</p>
          </div>
        </div>
        {/*tổng doanh thu */}
        <div className='bg-[var(--color-heavy)] border border-[var(--color-secondary)] rouded flex p-4 pr-8'>
          <img src={assets.revenue_icon} alt="" className='max-sm:hidden h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-[var(--color-secondary)] text-lg'>Total Revenue</p>
            <p className='text-[var(--color-four)] text-base'>250</p>
          </div>
        </div>
      </div>
      {/*booking gần đây */}
      <h2 className='text-xl text-[var(--color-secondary)] font-medium mb-5'>Recent Bookings</h2>
      <div className="w-full max-w-4xl text-left border border-[var(--color-secondary)] rounded-lg overflow-hidden">
        <div className="max-h-100 overflow-y-scroll">
          <table className="w-full">
            <thead className='bg-[var(--color-heavy)]'>
              <tr>
                <th className='py-3 px-4 text-[var(--color-secondary)]'>User Name</th>
                <th className='py-3 px-4 text-[var(--color-secondary)] max-sm:hidden'>Destination</th>
                <th className='py-3 px-4 text-[var(--color-secondary)] text-center'>Person</th>
                <th className='py-3 px-4 text-[var(--color-secondary)] text-center'>Check In</th>
                <th className='py-3 px-4 text-[var(--color-secondary)] text-center'>Check Out</th>
                <th className='py-3 px-4 text-[var(--color-secondary)] text-center'>Payment Status</th>
              </tr>
            </thead>
            <tbody className='text-sm text-[var(--color-secondary)]'>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className='border-t border-[var(--color-secondary)]'>
                  <td className='py-3 px-4'>User {i + 1}</td>
                  <td className='py-3 px-4 max-sm:hidden'>Destination {i + 1}</td>
                  <td className='py-3 px-4 text-center'>2</td>
                  <td className='py-3 px-4 text-center whitespace-nowrap'>2025-04-20 12:00PM</td>
                  <td className='py-3 px-4 text-center whitespace-nowrap'>2025-04-25 02:00PM</td>
                  <td className='py-3 px-4 text-center text-green-500'>Paid</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
