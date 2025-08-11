import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext.jsx'
import toast from 'react-hot-toast'
const Dashboard = () => {

  const { currency, user, getToken, toast, axios, formatPrice } = useAppContext()
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0
  })

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      
      const { data } = await axios.get('/api/bookings/hotel', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message || "Không thể lấy dữ liệu dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi lấy dữ liệu dashboard");
    }
  }

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
  return (
    <div>
      <Title align='left' font='Roboto' title='Dashboard' subTitle='Khách sạn của bạn trong tầm tay – nắm bắt thông tin và kiểm soát dễ dàng' />
      <div className='flex gap-4 my-8'>
        {/*tống lượt booking */}
        <div className='bg-[var(--color-2)]/50 border border-[var(--color-1)]/40 rounded-3xl flex p-4 pr-8'>
          <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10 invert' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-[var(--color-4)] text-lg'>Tổng lượt đặt</p>
            <p className='text-[var(--color-3)] text-base'>{dashboardData.totalBookings} LƯỢT</p>
          </div>
        </div>
        {/*tổng doanh thu */}
        <div className='bg-[var(--color-2)]/50 border border-[var(--color-1)]/40 rounded-3xl flex p-4 pr-8'>
          <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10 invert' />          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-[var(--color-4)] text-lg'>Tổng doanh thu</p>
            <p className='text-[var(--color-3)] text-base'>{formatPrice(dashboardData.totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/*book gần đây */}
      <h2 className='text-xl text-[var(--color-3)] font-medium mb-5'>Booking gần đây</h2>
      <div className='w-full max-w-3xl text-left border border-gray-300 rounded max-h-80 overflow-y-scroll mt-3'>

        <table className='w-full '>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>Tên khách</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Loại phòng</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Tổng tiền</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Trạng thái</th>
            </tr>
          </thead>

          <tbody className='text-sm'>
            {dashboardData.bookings.map((item, index) => (
              <tr key={index}>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.user.username}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>{item.room.roomType}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>{formatPrice(item.totalPrice)}</td>

                <td className='py-3 px-4 border-t border-gray-300 flex '>
                  <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
